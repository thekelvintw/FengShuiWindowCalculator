import React, { useState, useCallback, useEffect } from 'react';
import { Page, AppMode, SavedRecord, FortuneResult, CalculationState } from './types.ts';
import { calculateFortune } from './services/fortuneService';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useAuth } from './contexts/AuthContext';
import * as authService from './services/authService';
import { saveRecord, migrateLocalToCloud } from './services/store';

import HomePage from './components/HomePage';
import Step1North from './components/Step1North';
import Step2User from './components/Step2User';
import Step3Opening from './components/Step3Opening';
import ResultPage from './components/ResultPage';
import ListPage from './components/ListPage';
import Toast from './components/Toast';
import PostSavePage from './components/PostSavePage';
import ProfilePage from './components/ProfilePage';
import LoginSheet from './components/LoginSheet';
import { CloudArrowUpIcon } from './components/icons';
import { MAX_GUEST_RECORDS } from './constants';

export default function App() {
  const { user, loading, login, logout } = useAuth();
  const [page, setPage] = useState<Page>(Page.HOME);
  const [mode, setMode] = useState<AppMode | null>(null);

  const [localRecords, addLocalRecord, removeLocalRecord, updateLocalRecord, setAllLocalRecords] = useLocalStorage<SavedRecord>('fortuneRecords', []);
  const [cloudRecords, setCloudRecords] = useState<SavedRecord[]>([]);
  
  const records = user ? cloudRecords : localRecords;

  const [calculationState, setCalculationState] = useState<CalculationState>({
    northDeg: 0,
    userDeg: 0,
    relativeDeg: null,
    absoluteDeg: null,
  });
  const [result, setResult] = useState<FortuneResult | null>(null);
  
  const [toast, setToast] = useState<{ message: string; onUndo?: () => void } | null>(null);
  const [recordToEdit, setRecordToEdit] = useState<SavedRecord | null>(null);
  const [showLoginSheet, setShowLoginSheet] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);

  useEffect(() => {
    if (user) {
      authService.getCloudRecords(user.uid).then(setCloudRecords);
      // 登入成功後遷移本地記錄到雲端
      migrateLocalToCloud(user.uid).then(() => {
        setAllLocalRecords([]); // 清空本地記錄
        setToast({ message: "已同步本地記錄到雲端" });
      }).catch(error => {
        console.error('Failed to migrate local records:', error);
      });
    }
  }, [user]);

  const handleLogin = async () => {
    setShowLoginSheet(false);
    const loggedInUser = await login();
    if (loggedInUser) {
      if (localRecords.length > 0) {
        setIsMigrating(true);
        await authService.syncRecords(loggedInUser.uid, localRecords);
        const updatedCloudRecords = await authService.getCloudRecords(loggedInUser.uid);
        setCloudRecords(updatedCloudRecords);
        setAllLocalRecords([]); // Clear local records after migration
        setIsMigrating(false);
        setToast({ message: `已同步 ${localRecords.length} 筆記錄` });
      } else {
        setToast({ message: "登入成功" });
      }
    } else {
      setToast({ message: "登入未完成，稍後再試" });
    }
  };

  const handleLogout = async () => {
    await logout();
    setCloudRecords([]);
    setToast({ message: "已登出" });
  };

  const handleStart = (selectedMode: AppMode) => {
    setMode(selectedMode);
    setRecordToEdit(null);
    setCalculationState({ northDeg: 0, userDeg: 0, relativeDeg: null, absoluteDeg: null });
    setPage(Page.S1_NORTH);
  };

  const handleNorthSet = (north: number) => {
    setCalculationState(prev => ({ ...prev, northDeg: north }));
    setPage(Page.S2_USER);
  };

  const handleUserDirectionSet = (user: number) => {
    setCalculationState(prev => ({ ...prev, userDeg: user }));
    setPage(Page.S3_OPENING);
  };
  
  const handleCalculate = (relDeg: number | null, absDeg: number | null) => {
    const finalState = { ...calculationState, relativeDeg: relDeg, absoluteDeg: absDeg };
    setCalculationState(finalState);
    const res = calculateFortune(finalState.northDeg, finalState.userDeg, relDeg, absDeg);
    setResult(res);
    setPage(Page.R1_RESULT);
  };

  const handleSave = async (roomName: string) => {
    if (!result || !mode) return;

    const recordData: Omit<SavedRecord, 'id' | 'createdAt'> = {
      room: roomName,
      mode,
      ...calculationState,
      ...result,
    };

    try {
      if (recordToEdit) {
        // 更新現有記錄
        const updatedRecord = { ...recordData, id: recordToEdit.id, createdAt: recordToEdit.createdAt };
        await saveRecord(updatedRecord);
        
        if (user) {
          setCloudRecords(prev => prev.map(r => r.id === recordToEdit.id ? updatedRecord : r));
          setToast({ message: "已更新雲端記錄" });
        } else {
          updateLocalRecord(updatedRecord);
          setToast({ message: "已更新" });
        }
      } else {
        // 保存新記錄
        const newRecord: SavedRecord = { ...recordData, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
        await saveRecord(newRecord);
        
        if (user) {
          setCloudRecords(prev => [newRecord, ...prev]);
          setToast({ message: "已保存到雲端" });
        } else {
          const success = addLocalRecord(newRecord);
          if (!success) {
            setToast({ message: `本機記錄已達 ${MAX_GUEST_RECORDS} 筆上限`});
            return;
          }
          setToast({ message: "已保存" });
        }
      }
      
      setRecordToEdit(null);
      setPage(Page.R2_POST_SAVE);
    } catch (error) {
      console.error('Failed to save record:', error);
      setToast({ message: "保存失敗，請稍後再試" });
    }
  };

  const handleMeasureNext = () => {
    setRecordToEdit(null);
    setCalculationState(prev => ({...prev, relativeDeg: null, absoluteDeg: null}));
    setPage(Page.S3_OPENING);
  };

  const handleRetestFromList = (record: SavedRecord) => {
    setMode(record.mode);
    setCalculationState({
      northDeg: record.northDeg,
      userDeg: record.userDeg,
      relativeDeg: record.relativeDeg,
      absoluteDeg: record.absoluteDeg,
    });
    setRecordToEdit(record);
    setPage(Page.S3_OPENING);
  };

  const handleDeleteRecord = (id: string) => {
    if (window.confirm("確定要刪除這筆記錄嗎？")) {
       if (user) {
        authService.deleteCloudRecord(user.uid, id).then(() => {
          setCloudRecords(prev => prev.filter(r => r.id !== id));
          setToast({ message: "已從雲端刪除" });
        });
      } else {
        removeLocalRecord(id);
        setToast({ message: "已刪除" });
      }
    }
  };

  const handleGoHome = () => {
    setPage(Page.HOME);
    setMode(null);
    setRecordToEdit(null);
  };
  
  const handleGoToList = () => {
    setPage(Page.L1_LIST);
    setRecordToEdit(null);
  }
  
  const handleGoToProfile = () => {
    setPage(Page.PROFILE);
  }

  const renderPage = () => {
    switch (page) {
      case Page.HOME:
        return <HomePage onStart={handleStart} onShowList={handleGoToList} onShowProfile={handleGoToProfile} hasRecords={records.length > 0} />;
      case Page.S1_NORTH:
        return <Step1North onComplete={handleNorthSet} onBack={handleGoHome} />;
      case Page.S2_USER:
        return <Step2User mode={mode!} northDeg={calculationState.northDeg} onComplete={handleUserDirectionSet} onBack={() => setPage(Page.S1_NORTH)} onHome={handleGoHome} />;
      case Page.S3_OPENING:
        return <Step3Opening onCalculate={handleCalculate} onBack={() => setPage(Page.S2_USER)} onHome={handleGoHome} initialState={calculationState} />;
      case Page.R1_RESULT:
        return <ResultPage result={result!} mode={mode!} onSave={handleSave} onRetest={handleGoHome} onBack={() => setPage(Page.S3_OPENING)} initialRoomName={recordToEdit?.room || ''} isEditing={!!recordToEdit} onLoginPrompt={() => setShowLoginSheet(true)} />;
      case Page.R2_POST_SAVE:
        return <PostSavePage onMeasureNext={handleMeasureNext} onGoHome={handleGoHome} />;
      case Page.L1_LIST:
        return <ListPage records={records} onRetest={handleRetestFromList} onDelete={handleDeleteRecord} onHome={handleGoHome} onLoginPrompt={() => setShowLoginSheet(true)} />;
      case Page.PROFILE:
        return <ProfilePage onHome={handleGoHome} />;
      default:
        return <HomePage onStart={handleStart} onShowList={handleGoToList} onShowProfile={handleGoToProfile} hasRecords={records.length > 0}/>;
    }
  };

  if (loading) {
      return <div className="app-height w-full max-w-md mx-auto bg-white flex items-center justify-center"><p>載入中...</p></div>
  }
  
  if (isMigrating) {
      return (
        <div className="app-height w-full max-w-md mx-auto bg-white flex flex-col items-center justify-center text-center p-6">
          <CloudArrowUpIcon className="w-16 h-16 text-blue-500 animate-bounce mb-4" />
          <h2 className="text-2xl font-bold text-gray-800">資料同步中...</h2>
          <p className="text-gray-600 mt-2">{`正在把 ${localRecords.length} 筆本機記錄同步到雲端...`}</p>
        </div>
      );
  }

  return (
    <div className="page-shell">
      <main className="page-main">
        {renderPage()}
      </main>
      <LoginSheet isOpen={showLoginSheet} onClose={() => setShowLoginSheet(false)} onLogin={handleLogin} />
      {toast && (
        <Toast
          message={toast.message}
          onUndo={toast.onUndo}
          onDismiss={() => setToast(null)}
        />
      )}
    </div>
  );
}