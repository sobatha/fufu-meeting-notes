'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { TimerDisplay } from '@/components/common/TimerDisplay';
import { MoodEmojiPicker } from '@/components/common/MoodEmojiPicker';
import { RecordingWaveform } from '@/components/common/RecordingWaveform';
import { ProgressIndicator } from '@/components/common/ProgressIndicator';
import { Mic, StopCircle, Save, Clock, ArrowLeft } from 'lucide-react';

export default function MeetingWorkspacePage() {
  const [activeTab, setActiveTab] = useState('personal');
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [personalNotes, setPersonalNotes] = useState({
    1: '', // 健康
    2: '', // 仕事
    3: ''  // 家庭生活
  });
  const [sharedNotes, setSharedNotes] = useState({
    1: '', // 健康
    2: '', // 仕事
    3: ''  // 家庭生活
  });
  const [currentItemIndex, setCurrentItemIndex] = useState(1);
  
  const items = [
    { id: 1, title: '健康' },
    { id: 2, title: '仕事' },
    { id: 3, title: '家庭生活' }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      // Here you would typically save the recording
    } else {
      setIsRecording(true);
      setRecordingTime(0);
    }
  };
  
  const handleNextItem = () => {
    if (currentItemIndex < items.length) {
      setCurrentItemIndex(currentItemIndex + 1);
    }
  };
  
  const handlePrevItem = () => {
    if (currentItemIndex > 1) {
      setCurrentItemIndex(currentItemIndex - 1);
    }
  };
  
  const handlePersonalNoteChange = (itemId: number, value: string) => {
    setPersonalNotes(prev => ({
      ...prev,
      [itemId]: value
    }));
  };
  
  const handleSharedNoteChange = (itemId: number, value: string) => {
    setSharedNotes(prev => ({
      ...prev,
      [itemId]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              2025年6月ミーティング
            </h1>
          </div>
          <div className="flex items-center bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-lg">
            <Clock className="h-5 w-5 mr-2 text-indigo-500" />
            <TimerDisplay
              seconds={timeLeft}
              warningThreshold={60}
              dangerThreshold={0}
              isPaused={!isTimerRunning}
              onTogglePause={() => setIsTimerRunning(prev => !prev)}
              onTimeChange={setTimeLeft}
            />
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="personal" disabled={isRecording}>個人メモ</TabsTrigger>
              <TabsTrigger value="shared" disabled={isRecording}>共有メモ</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="personal" className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xl">
                  個人振り返り (10分)
                </CardTitle>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  各項目について振り返り、メモを残してください。他の人には見えません。
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {items.map(item => (
                    <div key={item.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium text-lg">{item.title}</h3>
                        <MoodEmojiPicker onChange={(mood) => console.log(`Mood for ${item.title}:`, mood)} />
                      </div>
                      <Textarea 
                        placeholder={`${item.title}についての振り返りを書いてください...`}
                        className="min-h-32"
                        value={personalNotes[item.id]}
                        onChange={(e) => handlePersonalNoteChange(item.id, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex justify-end">
                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    保存
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="shared" className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xl flex justify-between items-center">
                  <span>共有フェーズ: {items[currentItemIndex - 1].title}</span>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handlePrevItem}
                      disabled={currentItemIndex === 1 || isRecording}
                    >
                      前の項目
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleNextItem}
                      disabled={currentItemIndex === items.length || isRecording}
                    >
                      次の項目
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="bg-indigo-50 dark:bg-indigo-900/30 p-6 rounded-lg">
                      <h3 className="font-medium text-lg mb-4">音声記録</h3>
                      <div className="flex flex-col items-center space-y-4">
                        {isRecording ? (
                          <>
                            <RecordingWaveform
                              isRecording={isRecording}
                              className="h-16 w-full"
                              barCount={20}
                              barWidth={4}
                              barSpacing={2}
                            />
                            <TimerDisplay seconds={recordingTime} normalClassName="text-lg font-mono" />
                          </>
                        ) : (
                          <div className="text-center text-gray-500 dark:text-gray-400">
                            録音を開始すると波形が表示されます
                          </div>
                        )}
                        <Button 
                          onClick={toggleRecording} 
                          className={isRecording ? 'bg-red-500 hover:bg-red-600' : ''}
                        >
                          {isRecording ? (
                            <>
                              <StopCircle className="mr-2 h-5 w-5" />
                              録音を停止
                            </>
                          ) : (
                            <>
                              <Mic className="mr-2 h-5 w-5" />
                              録音を開始
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        録音は自動でテキスト化されます
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium text-lg">メモ</h3>
                    <Textarea 
                      placeholder="議論内容や決定事項をここに書き留めてください..."
                      className="min-h-56"
                      value={sharedNotes[currentItemIndex]}
                      onChange={(e) => handleSharedNoteChange(currentItemIndex, e.target.value)}
                    />
                    <div className="flex justify-end">
                      <Button>
                        <Save className="mr-2 h-4 w-4" />
                        保存
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="font-medium text-lg mb-2">進捗状況</h3>
                  <ProgressIndicator current={currentItemIndex} total={items.length} className="mt-2" />
                  
                  {currentItemIndex === items.length && (
                    <div className="mt-6 flex justify-center">
                      <Button className="bg-green-600 hover:bg-green-700">
                        すべての項目完了 - 議事録を生成
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
