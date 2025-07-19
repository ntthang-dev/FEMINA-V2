import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Calendar, Droplets, HeartPulse, X, Send, Bot, User, FileText, ChevronLeft, ChevronRight, HeartHandshake, Plus, LogOut, Users, BookOpen, ShieldCheck, CornerUpLeft, Sparkles, BarChart2, MessageCircle } from 'lucide-react';

// --- Cấu hình & Dữ liệu "Cơ sở dữ liệu" mẫu ---
const API_KEY = "AIzaSyDpUiYTWMF6xXYvCLTh757l-CmxS4GP74A"; // API key sẽ được cung cấp bởi môi trường chạy

const initialUsers = {
  'user1@email.com': { id: 1, name: 'Tran Thư', email: 'user1@email.com', password: '123' },
  'user2@email.com': { id: 2, name: 'Bảo Ngọc', email: 'user2@email.com', password: '123' },
};

const initialDailyData = {
  1: { // Dữ liệu cho user ID 1
    '2025-05-15': { period: true }, '2025-05-16': { period: true }, '2025-05-17': { period: true },
    '2025-06-12': { period: true }, '2025-06-13': { period: true }, '2025-06-14': { period: true }, '2025-06-15': { period: true },
    '2025-07-08': { mood: 'Lo lắng', symptoms: ['Đau đầu'], notes: 'Stress vì công việc' },
    '2025-07-09': { mood: 'Mệt mỏi', symptoms: ['Đau lưng'] },
    '2025-07-10': { period: true, symptoms: ['Đau bụng'], mood: 'Buồn', notes: 'Bắt đầu chu kỳ' },
    '2025-07-11': { period: true, symptoms: ['Mệt mỏi'], mood: 'Bình thường' },
    '2025-07-18': { relationship: true, mood: 'Vui vẻ', notes: 'Hẹn hò' },
  },
  2: { '2025-07-15': { period: true }, '2025-07-25': { relationship: true } },
};

const initialCycleHistory = {
    1: [{ startDate: '2025-05-15', length: 28 }, { startDate: '2025-06-12', length: 28 }],
    2: [],
};

const initialCommunityPosts = [ { id: 1, author: 'Mai Linh', question: 'Làm thế nào để giảm đau bụng kinh hiệu quả mà không cần dùng thuốc?', replies: 2, avatar: 'https://placehold.co/100x100/fde68a/f59e0b?text=ML', comments: [ { id: 101, author: 'Bảo Ngọc', text: 'Mình hay dùng túi chườm ấm và uống trà gừng, thấy đỡ hơn nhiều đó bạn.'}, { id: 102, author: 'An Nhiên', text: 'Bạn thử tập vài động tác yoga nhẹ nhàng xem, cũng giúp thư giãn cơ bụng lắm.'}, ]}, { id: 2, author: 'Thu Trang', question: 'Chu kỳ không đều sau khi tiêm vaccine có đáng lo không?', replies: 1, avatar: 'https://placehold.co/100x100/a5f3fc/0891b2?text=TT', comments: [ { id: 201, author: 'Minh Anh', text: 'Đây là một tác dụng phụ được ghi nhận ở một số người, thường sẽ tự điều chỉnh lại sau vài chu kỳ. Nhưng nếu bạn quá lo lắng thì nên đi khám bác sĩ nhé.'}, ]}, ];
const initialArticles = [ { id: 1, title: 'Hiểu rõ về chu kỳ kinh nguyệt của bạn', snippet: 'Mọi thứ bạn cần biết về các giai đoạn và hormone...', image: 'https://placehold.co/600x400/fecdd3/ef4444?text=Femina', content: 'Chu kỳ kinh nguyệt là một phần tự nhiên và quan trọng của sức khỏe sinh sản phụ nữ. Nó không chỉ đơn giản là những ngày "đèn đỏ" mà là một chuỗi các thay đổi phức tạp của hormone trong cơ thể. Một chu kỳ điển hình kéo dài khoảng 28 ngày, nhưng có thể dao động từ 21 đến 35 ngày. Nó được chia thành bốn giai đoạn chính: kinh nguyệt, giai đoạn nang trứng, rụng trứng và giai đoạn hoàng thể. Hiểu rõ từng giai đoạn giúp bạn nhận biết các dấu hiệu của cơ thể, dự đoán thời điểm rụng trứng và chăm sóc bản thân tốt hơn.' }, { id: 2, title: 'Dinh dưỡng quan trọng cho sức khỏe phụ nữ', snippet: 'Các loại thực phẩm giúp cân bằng nội tiết tố...', image: 'https://placehold.co/600x400/d8b4fe/a855f7?text=Femina', content: 'Chế độ ăn uống có ảnh hưởng sâu sắc đến sức khỏe nội tiết tố. Bổ sung đủ sắt, canxi, magie và vitamin B-complex là cực kỳ quan trọng, đặc biệt là trong những ngày hành kinh. Các loại thực phẩm giàu chất xơ như rau xanh, ngũ cốc nguyên hạt giúp ổn định đường huyết, trong khi chất béo lành mạnh từ quả bơ, các loại hạt và dầu ô liu hỗ trợ sản xuất hormone. Hạn chế đường, caffeine và thực phẩm chế biến sẵn có thể giúp giảm các triệu chứng tiền kinh nguyệt (PMS) như đau bụng, đầy hơi và thay đổi tâm trạng.'}, { id: 3, title: 'Các phương pháp tránh thai an toàn và hiệu quả', snippet: 'Tìm hiểu ưu và nhược điểm của từng phương pháp.', image: 'https://placehold.co/600x400/a7f3d0/10b981?text=Femina', content: 'Có rất nhiều lựa chọn tránh thai, từ các phương pháp nội tiết tố (thuốc uống, miếng dán, vòng âm đạo) đến các phương pháp không nội tiết tố (bao cao su, vòng tránh thai bằng đồng). Mỗi phương pháp có ưu, nhược điểm và tỷ lệ hiệu quả khác nhau. Việc lựa chọn phương pháp phù hợp nhất phụ thuộc vào tình trạng sức khỏe, lối sống và kế hoạch tương lai của bạn. Điều quan trọng là phải thảo luận kỹ với bác sĩ hoặc chuyên gia y tế để đưa ra quyết định sáng suốt và an toàn.' }, ];

// --- Các hàm tiện ích & Tính toán ---
const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();
const formatDate = (date) => date.toISOString().split('T')[0];

const calculatePredictions = (cycleHistory) => {
    if (!cycleHistory || cycleHistory.length < 2) {
        return { averageCycleLength: 28, nextPeriodDate: null, fertileWindow: [], ovulationDay: null, regularity: 'Chưa đủ dữ liệu' };
    }
    const validCycles = cycleHistory.filter(c => c.length > 10 && c.length < 60);
    if (validCycles.length < 2) {
        return { averageCycleLength: 28, nextPeriodDate: null, fertileWindow: [], ovulationDay: null, regularity: 'Chưa đủ dữ liệu' };
    }
    
    const lengths = validCycles.map(c => c.length);
    const totalLength = lengths.reduce((acc, len) => acc + len, 0);
    const averageCycleLength = Math.round(totalLength / lengths.length);
    
    // Tính độ lệch chuẩn để xác định độ đều đặn
    const mean = averageCycleLength;
    const stdDev = Math.sqrt(lengths.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / lengths.length);
    let regularity = 'Đều đặn';
    if (stdDev > 7) regularity = 'Rối loạn';
    else if (stdDev > 3) regularity = 'Hơi thất thường';

    const lastCycle = validCycles[validCycles.length - 1];
    const lastStartDate = new Date(lastCycle.startDate + 'T00:00:00');

    const nextPeriodDate = new Date(lastStartDate);
    nextPeriodDate.setDate(lastStartDate.getDate() + averageCycleLength);

    const ovulationDay = new Date(nextPeriodDate);
    ovulationDay.setDate(nextPeriodDate.getDate() - 14);

    const fertileWindow = [];
    for (let i = -5; i <= 0; i++) {
        const day = new Date(ovulationDay);
        day.setDate(ovulationDay.getDate() + i);
        fertileWindow.push(formatDate(day));
    }

    return {
        averageCycleLength,
        nextPeriodDate: formatDate(nextPeriodDate),
        fertileWindow,
        ovulationDay: formatDate(ovulationDay),
        regularity,
    };
};

// --- Thành phần chính ---
export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState(initialUsers);
  const [allDailyData, setAllDailyData] = useState(initialDailyData);
  const [allCycleHistory, setAllCycleHistory] = useState(initialCycleHistory);
  const [posts, setPosts] = useState(initialCommunityPosts);

  const handleRegister = (name, email, password) => { if (users[email]) return { success: false, message: 'Email đã tồn tại.' }; const newId = Date.now(); const newUser = { id: newId, name, email, password }; setUsers(prev => ({...prev, [email]: newUser})); setAllDailyData(prev => ({...prev, [newId]: {}})); setAllCycleHistory(prev => ({...prev, [newId]: []})); setCurrentUser(newUser); return { success: true }; };
  const handleLogin = (email, password) => { const user = users[email]; if (user && user.password === password) { setCurrentUser(user); return { success: true }; } return { success: false, message: 'Email hoặc mật khẩu không chính xác.' }; };
  const handlePostComment = (postId, commentText) => { setPosts(prevPosts => prevPosts.map(post => { if (post.id === postId) { const newComment = { id: Date.now(), author: currentUser.name, text: commentText }; const updatedComments = post.comments ? [...post.comments, newComment] : [newComment]; return { ...post, comments: updatedComments, replies: updatedComments.length }; } return post; })); };

  if (!currentUser) return <AuthScreen onLogin={handleLogin} onRegister={handleRegister} />;

  return <MainApp 
    user={currentUser} 
    onLogout={() => setCurrentUser(null)} 
    dailyData={allDailyData[currentUser.id]}
    setDailyData={(data) => setAllDailyData(prev => ({...prev, [currentUser.id]: data}))}
    cycleHistory={allCycleHistory[currentUser.id]}
    setCycleHistory={(history) => setAllCycleHistory(prev => ({...prev, [currentUser.id]: history}))}
    posts={posts}
    onPostComment={handlePostComment}
    />;
}

// --- Giao diện ứng dụng chính ---
const MainApp = ({ user, onLogout, dailyData, setDailyData, cycleHistory, setCycleHistory, posts, onPostComment }) => {
  const [activeScreen, setActiveScreen] = useState('home');
  const [screenParams, setScreenParams] = useState({});
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  const predictions = useMemo(() => calculatePredictions(cycleHistory), [cycleHistory]);

  const navigate = (screen, params = {}) => {
      setActiveScreen(screen);
      setScreenParams(params);
  };
  
  const updateDailyData = (date, newData) => {
    const updatedDailyData = { ...dailyData, [date]: { ...dailyData[date], ...newData } };
    setDailyData(updatedDailyData);

    if (newData.period) {
        const yesterday = new Date(date + 'T00:00:00');
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = formatDate(yesterday);

        if (!dailyData[yesterdayStr]?.period && !cycleHistory.find(c => c.startDate === date)) {
            let updatedHistory = [...cycleHistory];
            if (updatedHistory.length > 0) {
                const lastCycle = updatedHistory[updatedHistory.length - 1];
                const lastStartDate = new Date(lastCycle.startDate);
                const newStartDate = new Date(date);
                const length = Math.round((newStartDate - lastStartDate) / (1000 * 60 * 60 * 24));
                if (length > 0) lastCycle.length = length;
            }
            updatedHistory.push({ startDate: date, length: 28 });
            setCycleHistory(updatedHistory);
        }
    }
  };

  const screens = {
    home: <HomeScreen navigate={navigate} user={user} predictions={predictions} dailyData={dailyData} cycleHistory={cycleHistory} />,
    calendar: <CalendarScreen dailyData={dailyData} predictions={predictions} onUpdateData={updateDailyData} />,
    chart: <CycleChartScreen cycleHistory={cycleHistory} />,
    articles: <ArticlesScreen navigate={navigate} articles={initialArticles} />,
    'article-detail': <ArticleDetailScreen navigate={navigate} article={initialArticles.find(a => a.id === screenParams.id)} />,
    community: <CommunityScreen navigate={navigate} posts={posts} />,
    'post-detail': <PostDetailScreen navigate={navigate} post={posts.find(p => p.id === screenParams.id)} onPostComment={onPostComment} />,
    profile: <ProfileScreen user={user} onLogout={onLogout} />,
  };
  
  return (
    <div className="bg-gray-50 font-sans">
      <div className="relative mx-auto min-h-screen bg-white shadow-2xl flex flex-col sm:max-w-md lg:max-w-lg">
        <Header onProfileClick={() => navigate('profile')} />
        <main className="flex-grow p-4 sm:p-6 overflow-y-auto">
          {screens[activeScreen]}
        </main>
        <ChatbotFab onOpen={() => setIsChatOpen(true)} />
        {isChatOpen && <ChatbotModal onClose={() => setIsChatOpen(false)} />}
        <BottomNav activeScreen={activeScreen} navigate={navigate} />
      </div>
    </div>
  );
};

// --- Màn hình chính & Các thành phần mới ---

const HomeScreen = ({ navigate, user, predictions, dailyData, cycleHistory }) => {
    const today = formatDate(new Date());
    const daysUntilNextPeriod = predictions.nextPeriodDate 
        ? Math.ceil((new Date(predictions.nextPeriodDate) - new Date(today)) / (1000 * 60 * 60 * 24))
        : null;

    const getPredictionEmoji = () => {
        if (daysUntilNextPeriod === null) return '🤔';
        if (dailyData[today]?.period) return '🩸';
        if (predictions.fertileWindow.includes(today)) return '💕';
        if (daysUntilNextPeriod <= 3 && daysUntilNextPeriod > 0) return '⏳';
        return '🗓️';
    };

    return (
        <div className="space-y-6">
            <div><h2 className="text-2xl font-bold text-gray-700">Chào, {user.name}!</h2><p className="text-gray-500">Hôm nay bạn cảm thấy thế nào?</p></div>
            <div className="p-6 bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl shadow-sm text-center">
                <p className="text-sm font-medium text-pink-700 flex items-center justify-center gap-2">
                    <span className="text-2xl">{getPredictionEmoji()}</span>
                    <span>DỰ ĐOÁN CHU KỲ</span>
                </p>
                {daysUntilNextPeriod !== null ? (
                    <>
                        <p className="text-4xl font-bold text-pink-600 my-2">{daysUntilNextPeriod > 0 ? `${daysUntilNextPeriod} ngày nữa` : (daysUntilNextPeriod === 0 ? 'Hôm nay!' : 'Đã trễ')}</p>
                        <p className="text-gray-600">Chu kỳ của bạn: {predictions.regularity}</p>
                    </>
                ) : (
                    <p className="text-lg text-gray-600 my-2">Hãy ghi nhận chu kỳ đầu tiên của bạn để bắt đầu dự đoán!</p>
                )}
            </div>
            <AIPredictionCard dailyData={dailyData} cycleHistory={cycleHistory} predictions={predictions} />
            <div className="grid grid-cols-2 gap-4">
                <FeatureCard onClick={() => navigate('calendar')} icon={<Calendar className="text-pink-500" />} title="Lịch Chu Kỳ" subtitle="Theo dõi & Ghi chú" />
                <FeatureCard onClick={() => navigate('chart')} icon={<BarChart2 className="text-teal-500" />} title="Biểu đồ Chu kỳ" subtitle="Phân tích & Thống kê" />
                <FeatureCard onClick={() => navigate('articles')} icon={<BookOpen className="text-purple-500" />} title="Kiến Thức" subtitle="Bài viết hữu ích" />
                <FeatureCard onClick={() => navigate('community')} icon={<Users className="text-blue-500" />} title="Hỏi Đáp" subtitle="Cộng đồng chia sẻ" />
            </div>
        </div>
    );
};

const AIPredictionCard = ({ dailyData, cycleHistory, predictions }) => {
    const [prediction, setPrediction] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const getAIPrediction = async () => {
        setIsLoading(true);
        setPrediction('');

        const recentLogs = Object.entries(dailyData)
            .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
            .slice(0, 30) // Lấy nhiều dữ liệu hơn
            .map(([date, data]) => `Ngày ${date}: ${JSON.stringify(data)}`);

        const prompt = `Bạn là Femina, một cố vấn sức khỏe AI thẳng thắn, khoa học và cởi mở. Tông giọng của bạn chuyên nghiệp nhưng gần gũi, không né tránh các chủ đề về sức khỏe tình dục.
        
        **Dữ liệu người dùng:**
        - **Phân tích chu kỳ:** Tình trạng chu kỳ của người dùng là '${predictions.regularity}'. Độ dài trung bình: ${predictions.averageCycleLength} ngày. Ngày kinh nguyệt tiếp theo dự đoán là ${predictions.nextPeriodDate}.
        - **Nhật ký gần đây (30 ngày):** ${recentLogs.join('; ')}

        **Nhiệm vụ của bạn:**
        Hãy đưa ra một phân tích tổng thể bằng tiếng Việt, bao gồm 4 phần rõ ràng:

        1.  **Phân tích Sức khỏe Chu kỳ:**
            * Nhận xét về tình trạng chu kỳ: "${predictions.regularity}". Nếu bất thường, hãy chỉ ra (ví dụ: "Chu kỳ của bạn gần đây có vẻ hơi thất thường, với các độ dài thay đổi...").
            * So sánh chu kỳ gần nhất với mức trung bình (sớm/trễ).

        2.  **Phân tích Triệu chứng & Tâm trạng:**
            * Tìm ra một quy luật nổi bật nhất kết nối triệu chứng/tâm trạng với các giai đoạn của chu kỳ (ví dụ: "Tôi nhận thấy bạn thường ghi nhận 'đau đầu' và 'stress' vào khoảng một tuần trước ngày dự đoán có kinh.").
            * Dự đoán khả năng lặp lại của triệu chứng này trong chu kỳ tới.

        3.  **Phân tích Sức khỏe Tình dục:**
            * Phân tích thẳng thắn các ghi nhận về hoạt động quan hệ.
            * Nếu có hoạt động trong những ngày thụ thai, hãy đề cập một cách giáo dục: "Bạn có ghi nhận hoạt động quan hệ trong giai đoạn có khả năng thụ thai cao. Điều này cần được lưu ý tùy theo kế hoạch của bạn: nếu đang muốn có con, đây là thời điểm tốt. Nếu không, hãy luôn đảm bảo sử dụng biện pháp bảo vệ an toàn."
            * Nếu không có, có thể bỏ qua hoặc chỉ đề cập nhẹ nhàng.

        4.  **Lời khuyên Tổng hợp:**
            * Dựa trên tất cả phân tích trên, đưa ra MỘT lời khuyên quan trọng nhất và mang tính hành động cho tuần tới.

        **QUAN TRỌNG:** Giữ giọng văn cởi mở, khoa học và không phán xét. Kết thúc bằng câu: "Phân tích này dựa trên AI và chỉ mang tính tham khảo, không thay thế cho chẩn đoán y tế."`;
        
        try {
            const payload = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!response.ok) throw new Error('API call failed');
            const result = await response.json();
            setPrediction(result.candidates[0].content.parts[0].text);
        } catch (error) {
            setPrediction('Rất tiếc, đã có lỗi xảy ra khi tạo phân tích cho bạn.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl space-y-3">
            <div className="flex items-center gap-2"><Sparkles className="text-indigo-500" /><h3 className="font-bold text-gray-800">Phân tích & Dự đoán từ AI</h3></div>
            {isLoading && <p className="text-sm text-gray-600">AI đang phân tích dữ liệu của bạn...</p>}
            {prediction && <p className="text-sm text-gray-700 whitespace-pre-line">{prediction}</p>}
            {!prediction && !isLoading && <p className="text-sm text-gray-600">Nhấn để AI phân tích toàn diện nhật ký sức khỏe và đưa ra dự báo cho chu kỳ tới.</p>}
            <button onClick={getAIPrediction} disabled={isLoading || predictions.regularity === 'Chưa đủ dữ liệu'} className="w-full bg-indigo-500 text-white font-semibold py-2 rounded-lg hover:bg-indigo-600 transition-colors disabled:bg-indigo-300 disabled:cursor-not-allowed">{isLoading ? 'Đang phân tích...' : 'Phân tích ngay'}</button>
        </div>
    );
};

// --- Các màn hình được cập nhật ---

const CalendarScreen = ({ dailyData, predictions, onUpdateData }) => {
    const [currentDate, setCurrentDate] = useState(new Date('2025-07-01'));
    const [isLogModalOpen, setIsLogModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const handleDayClick = (dateStr) => {
        setSelectedDate(dateStr);
        setIsLogModalOpen(true);
    };

    const handleSaveLog = (date, data) => {
        onUpdateData(date, data);
        setIsLogModalOpen(false);
    };
    
    const renderDays = () => {
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);
        const days = [];
        for (let i = 0; i < firstDay; i++) { days.push(<div key={`empty-${i}`} className="w-full h-12"></div>); }
        for (let i = 1; i <= daysInMonth; i++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            const dataForDay = dailyData[dateStr] || {};
            
            let dayClass = 'hover:bg-gray-100';
            if (predictions.nextPeriodDate === dateStr) dayClass = 'bg-red-200';
            else if (predictions.fertileWindow.includes(dateStr)) dayClass = 'bg-blue-100';
            if (predictions.ovulationDay === dateStr) dayClass += ' border-2 border-blue-400';

            days.push(
                <div key={i} onClick={() => handleDayClick(dateStr)} className={`w-full h-14 flex flex-col items-center justify-center rounded-lg cursor-pointer transition-colors ${dayClass}`}>
                    <span className="text-sm font-medium">{i}</span>
                    <div className="flex gap-1 mt-1">
                        {dataForDay.period && <Droplets size={10} className='text-red-500' />}
                        {dataForDay.relationship && <HeartHandshake size={10} className='text-purple-500' />}
                    </div>
                </div>
            );
        }
        return days;
    };

    return (
      <div>
        <div className="flex items-center justify-between mb-4"><button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="p-2 rounded-full hover:bg-gray-100"><ChevronLeft /></button><h2 className="text-xl font-bold">{currentDate.toLocaleString('vi-VN', { month: 'long' })} {year}</h2><button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="p-2 rounded-full hover:bg-gray-100"><ChevronRight /></button></div>
        <div className="grid grid-cols-7 gap-1 text-center text-sm text-gray-500 mb-2">{['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(d => <div key={d}>{d}</div>)}</div>
        <div className="grid grid-cols-7 gap-1">{renderDays()}</div>
        {isLogModalOpen && <LogModal date={selectedDate} data={dailyData[selectedDate] || {}} onSave={handleSaveLog} onClose={() => setIsLogModalOpen(false)} />}
      </div>
    );
};

const LogModal = ({ date, data, onSave, onClose }) => {
    const [logData, setLogData] = useState(data);

    const handleSave = () => {
        onSave(date, logData);
    };
    
    const handleUpdate = (field, value) => setLogData(prev => ({...prev, [field]: value}));
    const handleSymptomToggle = (symptom) => { const currentSymptoms = logData.symptoms || []; const newSymptoms = currentSymptoms.includes(symptom) ? currentSymptoms.filter(s => s !== symptom) : [...currentSymptoms, symptom]; handleUpdate('symptoms', newSymptoms); };
    const symptomsList = ['Đau bụng', 'Đau đầu', 'Mệt mỏi', 'Nổi mụn', 'Đau lưng'];
    const moods = ['Vui vẻ', 'Buồn', 'Bình thường', 'Cáu gắt', 'Lo lắng'];

    return (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
                <header className="p-4 border-b flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-lg">Ghi chú cho ngày</h3>
                        <p className="text-sm text-gray-500">{date.split('-').reverse().join('/')}</p>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X size={24} /></button>
                </header>
                <main className="p-4 space-y-4 overflow-y-auto">
                    <div className="p-3 bg-gray-50 rounded-lg"><h3 className="font-semibold mb-2 text-sm">Kinh nguyệt</h3><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={!!logData.period} onChange={e => handleUpdate('period', e.target.checked)} className="h-5 w-5 rounded text-pink-500 focus:ring-pink-500" /><span>Hôm nay là ngày có kinh nguyệt</span></label></div>
                    <div className="p-3 bg-gray-50 rounded-lg"><h3 className="font-semibold mb-2 text-sm">Hoạt động quan hệ</h3><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={!!logData.relationship} onChange={e => handleUpdate('relationship', e.target.checked)} className="h-5 w-5 rounded text-purple-500 focus:ring-purple-500" /><span>Ghi nhận hoạt động quan hệ</span></label></div>
                    <div className="p-3 bg-gray-50 rounded-lg"><h3 className="font-semibold mb-2 text-sm">Triệu chứng</h3><div className="flex flex-wrap gap-2">{symptomsList.map(symptom => (<button key={symptom} onClick={() => handleSymptomToggle(symptom)} className={`px-3 py-1 text-xs rounded-full border ${ (logData.symptoms || []).includes(symptom) ? 'bg-purple-500 text-white border-purple-500' : 'bg-white text-gray-700'}`}>{symptom}</button>))}</div></div>
                    <div className="p-3 bg-gray-50 rounded-lg"><h3 className="font-semibold mb-2 text-sm">Tâm trạng</h3><div className="flex flex-wrap gap-2">{moods.map(mood => (<button key={mood} onClick={() => handleUpdate('mood', mood)} className={`px-3 py-1 text-xs rounded-full border ${ logData.mood === mood ? 'bg-teal-500 text-white border-teal-500' : 'bg-white text-gray-700'}`}>{mood}</button>))}</div></div>
                    <div className="p-3 bg-gray-50 rounded-lg"><h3 className="font-semibold mb-2 text-sm">Ghi chú khác</h3><textarea value={logData.notes || ''} onChange={e => handleUpdate('notes', e.target.value)} rows="3" className="w-full p-2 border rounded-md focus:ring-pink-500 focus:border-pink-500 text-sm" placeholder="Thêm ghi chú..."></textarea></div>
                </main>
                <footer className="p-4 border-t">
                    <button onClick={handleSave} className="w-full bg-pink-600 text-white font-bold py-3 rounded-lg hover:bg-pink-700 transition-colors">Lưu Thay Đổi</button>
                </footer>
            </div>
        </div>
    );
};

const CycleChartScreen = ({ cycleHistory }) => {
    const validCycles = cycleHistory.filter(c => c.length > 10 && c.length < 60);
    const maxLength = Math.max(...validCycles.map(c => c.length), 35);

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Biểu đồ Độ dài Chu kỳ</h2>
            {validCycles.length > 1 ? (
                <div className="p-4 bg-white rounded-lg border">
                    <div className="flex items-end justify-around h-64 space-x-2">
                        {validCycles.map((cycle, index) => (
                            <div key={index} className="flex flex-col items-center flex-1">
                                <div className="w-full bg-pink-200 rounded-t-md hover:bg-pink-300 transition-colors" style={{ height: `${(cycle.length / maxLength) * 100}%` }}>
                                    <div className="text-center text-sm font-bold text-pink-700 pt-1">{cycle.length}</div>
                                </div>
                                <div className="text-xs text-gray-500 mt-1 whitespace-nowrap">{cycle.startDate.substring(5).replace('-', '/')}</div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center text-sm text-gray-600 mt-4">Biểu đồ thể hiện độ dài (số ngày) của mỗi chu kỳ.</div>
                </div>
            ) : (
                <div className="text-center text-gray-500 p-8">
                    <BarChart2 size={48} className="mx-auto text-gray-400" />
                    <p className="mt-2">Chưa có đủ dữ liệu để vẽ biểu đồ.</p>
                    <p className="text-sm">Hãy ghi nhận ít nhất 2 chu kỳ để bắt đầu xem thống kê.</p>
                </div>
            )}
        </div>
    );
};


// --- Các thành phần khác ---
const AuthScreen = ({ onLogin, onRegister }) => { const [isLoginView, setIsLoginView] = useState(true); const [email, setEmail] = useState('user1@email.com'); const [password, setPassword] = useState('123'); const [name, setName] = useState(''); const [error, setError] = useState(''); const handleSubmit = () => { setError(''); let result; if (isLoginView) { result = onLogin(email, password); } else { if (!name) { setError('Vui lòng nhập tên của bạn.'); return; } result = onRegister(name, email, password); } if (!result.success) { setError(result.message); } }; return (<div className="bg-gray-50 font-sans"><div className="relative mx-auto min-h-screen max-w-md bg-white shadow-2xl flex flex-col justify-center p-8"><div className="text-center mb-10"><div className="flex items-center justify-center gap-2"><Droplets className="text-pink-500" size={36} /><h1 className="text-4xl font-bold text-gray-800">Femina</h1></div><p className="text-gray-500 mt-2">{isLoginView ? 'Chào mừng bạn trở lại!' : 'Tạo tài khoản mới'}</p></div><div className="space-y-4">{!isLoginView && <input type="text" placeholder="Tên của bạn" value={name} onChange={e => setName(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-pink-500 focus:border-pink-500" />}<input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-pink-500 focus:border-pink-500" /><input type="password" placeholder="Mật khẩu" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-pink-500 focus:border-pink-500" />{error && <p className="text-red-500 text-sm text-center">{error}</p>}<button onClick={handleSubmit} className="w-full bg-pink-600 text-white font-bold py-3 rounded-lg hover:bg-pink-700 transition-colors">{isLoginView ? 'Đăng Nhập' : 'Đăng Ký'}</button><button onClick={() => setIsLoginView(!isLoginView)} className="w-full text-pink-600 font-semibold py-2">{isLoginView ? 'Chưa có tài khoản? Đăng ký' : 'Đã có tài khoản? Đăng nhập'}</button></div></div></div>); };
const Header = ({ onProfileClick }) => ( <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-10 px-6 py-4 border-b border-gray-100 flex justify-between items-center"> <div className="flex items-center gap-2"> <Droplets className="text-pink-500" size={28} /> <h1 className="text-2xl font-bold text-gray-800">Femina</h1> </div> <button onClick={onProfileClick} className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center"> <User size={20} className="text-gray-500" /> </button> </header> );
const FeatureCard = ({ icon, title, subtitle, onClick }) => (<div onClick={onClick} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-shadow cursor-pointer"><div className="mb-2">{React.cloneElement(icon, { size: 28 })}</div><h3 className="font-bold text-gray-800">{title}</h3><p className="text-sm text-gray-500">{subtitle}</p></div>);
const BottomNav = ({ activeScreen, navigate }) => { const navItems = [{ id: 'home', icon: <Droplets />, label: 'Trang chủ' },{ id: 'calendar', icon: <Calendar />, label: 'Lịch' },{ id: 'chart', icon: <BarChart2 />, label: 'Biểu đồ' },{ id: 'community', icon: <Users />, label: 'Cộng đồng' }]; return (<nav className="bg-white/90 backdrop-blur-lg sticky bottom-0 z-10 border-t border-gray-100"><div className="flex justify-around py-2">{navItems.map(item => (<button key={item.id} onClick={() => navigate(item.id)} className={`flex flex-col items-center justify-center w-20 p-2 rounded-lg transition-colors ${activeScreen.startsWith(item.id) ? 'text-pink-600' : 'text-gray-500 hover:bg-pink-50'}`}>{React.cloneElement(item.icon, { size: 24, strokeWidth: activeScreen.startsWith(item.id) ? 2.5 : 2 })}<span className="text-xs font-medium mt-1">{item.label}</span></button>))}</div></nav>); };
const BackButton = ({ onClick }) => (<button onClick={onClick} className="flex items-center gap-2 text-gray-600 font-semibold mb-4 hover:text-pink-600"><CornerUpLeft size={20} /><span>Quay lại</span></button>);
const ArticleDetailScreen = ({ navigate, article }) => (<div><BackButton onClick={() => navigate('articles')} /><img src={article.image} alt={article.title} className="w-full h-48 object-cover rounded-lg mb-4" /><h2 className="text-3xl font-bold text-gray-800 mb-2">{article.title}</h2><p className="text-gray-600 whitespace-pre-line leading-relaxed">{article.content}</p></div>);
const PostDetailScreen = ({ navigate, post, onPostComment }) => { const [commentText, setCommentText] = useState(''); const commentsEndRef = useRef(null); const handlePost = () => { if(commentText.trim()){ onPostComment(post.id, commentText.trim()); setCommentText(''); } }; useEffect(() => { commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [post.comments]); return (<div><BackButton onClick={() => navigate('community')} /><div className="p-4 bg-white rounded-lg border mb-4"><div className="flex items-start gap-3"><img src={post.avatar} alt={post.author} className="w-10 h-10 rounded-full" /><div className="flex-1"><p className="font-semibold text-gray-800">{post.author}</p><p className="text-gray-700 mt-1">{post.question}</p></div></div></div><h3 className="font-bold text-lg mb-2">Bình luận ({(post.comments || []).length})</h3><div className="space-y-3 mb-4">{(post.comments || []).map(comment => (<div key={comment.id} className="p-3 bg-gray-50 rounded-lg text-sm"><p className="font-semibold text-pink-700">{comment.author}</p><p className="text-gray-800">{comment.text}</p></div>))}{<div ref={commentsEndRef} />}</div><div className="flex items-center gap-2 sticky bottom-0 bg-white py-3"><input value={commentText} onChange={e => setCommentText(e.target.value)} type="text" placeholder="Viết bình luận..." className="flex-grow bg-gray-100 border-transparent focus:ring-pink-500 focus:border-pink-500 rounded-full py-2 px-4" /><button onClick={handlePost} className="w-10 h-10 bg-pink-500 text-white rounded-full flex items-center justify-center flex-shrink-0 disabled:bg-gray-300"><Send size={20} /></button></div></div>); };
const ArticlesScreen = ({ navigate, articles }) => (<div><h2 className="text-2xl font-bold text-gray-700 mb-4">Kiến thức cho bạn</h2><div className="space-y-4">{articles.map(article => (<div key={article.id} onClick={() => navigate('article-detail', {id: article.id})} className="flex items-center gap-4 p-3 bg-white rounded-lg border hover:shadow-md cursor-pointer"><img src={article.image} alt={article.title} className="w-24 h-24 object-cover rounded-md" /><div className="flex-1"><h3 className="font-bold text-gray-800">{article.title}</h3><p className="text-sm text-gray-500 mt-1">{article.snippet}</p></div></div>))}</div></div>);
const CommunityScreen = ({ navigate, posts }) => (<div><div className="flex justify-between items-center mb-4"><h2 className="text-2xl font-bold text-gray-700">Hỏi đáp Cộng đồng</h2><button className="bg-pink-500 text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-pink-600">Đặt câu hỏi</button></div><div className="space-y-4">{posts.map(post => (<div key={post.id} onClick={() => navigate('post-detail', {id: post.id})} className="p-4 bg-white rounded-lg border cursor-pointer hover:shadow-md"><div className="flex items-start gap-3"><img src={post.avatar} alt={post.author} className="w-10 h-10 rounded-full" /><div className="flex-1"><p className="font-semibold text-gray-800">{post.author}</p><p className="text-gray-700 mt-1">{post.question}</p><p className="text-xs text-blue-500 mt-2">{(post.replies || 0)} câu trả lời</p></div></div></div>))}</div></div>);
const ProfileScreen = ({ user, onLogout }) => ( <div className="space-y-6"><div className="flex flex-col items-center text-center"><div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4"><User size={48} className="text-gray-500" /></div><h2 className="text-2xl font-bold">{user.name}</h2><p className="text-gray-500">{user.email}</p></div><div className="space-y-2"><button className="w-full flex items-center gap-3 p-4 bg-gray-100 rounded-lg text-left"><ShieldCheck className="text-gray-600" /><span>Tài khoản & Bảo mật</span></button><button className="w-full flex items-center gap-3 p-4 bg-gray-100 rounded-lg text-left"><MessageCircle className="text-gray-600" /><span>Cài đặt thông báo</span></button></div><button onClick={onLogout} className="w-full flex items-center justify-center gap-3 p-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600"><LogOut size={20} /><span>Đăng Xuất</span></button></div>);
const ChatbotFab = ({ onOpen }) => (<button onClick={onOpen} className="fixed bottom-24 right-6 z-20 w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition-transform" aria-label="Mở Trợ lý ảo"><Bot size={32} /></button>);
const ChatbotModal = ({ onClose }) => { const [messages, setMessages] = useState([{ sender: 'bot', text: 'Xin chào! Tôi là Femina, trợ lý ảo của bạn. Tôi có thể giúp gì cho bạn về sức khỏe sinh sản? (Lưu ý: Tôi không phải chuyên gia y tế.)' }]); const [userInput, setUserInput] = useState(''); const [isLoading, setIsLoading] = useState(false); const messagesEndRef = useRef(null); const scrollToBottom = () => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }; useEffect(scrollToBottom, [messages]); const handleSendMessage = async () => { const trimmedInput = userInput.trim(); if (!trimmedInput) return; const newMessages = [...messages, { sender: 'user', text: trimmedInput }]; setMessages(newMessages); setUserInput(''); setIsLoading(true); try { const systemPrompt = `Bạn là một trợ lý AI đồng cảm và hữu ích trong ứng dụng sức khỏe sinh sản tên là 'Femina'. Cung cấp thông tin hỗ trợ, thân thiện và an toàn. Luôn nhắc nhở người dùng rằng bạn không phải là chuyên gia y tế và họ nên tham khảo ý kiến bác sĩ cho các vấn đề nghiêm trọng. Trả lời bằng tiếng Việt.`; const chatHistory = [{ role: "user", parts: [{ text: systemPrompt + "\n\nCâu hỏi của người dùng: " + trimmedInput }] }]; const payload = { contents: chatHistory }; const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }); if (!response.ok) throw new Error(`API call failed with status: ${response.status}`); const result = await response.json(); let botResponse = 'Xin lỗi, tôi gặp sự cố khi xử lý yêu cầu của bạn.'; if (result.candidates && result.candidates[0].content.parts.length > 0) botResponse = result.candidates[0].content.parts[0].text; setMessages(prev => [...prev, { sender: 'bot', text: botResponse }]); } catch (error) { console.error("Error calling Gemini API:", error); setMessages(prev => [...prev, { sender: 'bot', text: 'Rất tiếc, đã có lỗi xảy ra. Vui lòng thử lại sau.' }]); } finally { setIsLoading(false); } }; return (<div className="fixed inset-0 bg-black/40 z-30 flex items-center justify-center p-4"><div className="w-full max-w-md h-[85vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"><header className="p-4 border-b flex items-center justify-between"><div className="flex items-center gap-3"><div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center text-white"><Bot size={24} /></div><div><h3 className="font-bold text-lg">Femina Bot</h3><p className="text-sm text-green-500">● Đang hoạt động</p></div></div><button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X size={24} /></button></header><div className="flex-grow p-4 overflow-y-auto space-y-4">{messages.map((msg, index) => (<div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>{msg.sender === 'bot' && <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0"><Bot size={18} className="text-gray-600"/></div>}<div className={`max-w-[80%] p-3 rounded-2xl ${msg.sender === 'user' ? 'bg-pink-500 text-white rounded-br-lg' : 'bg-gray-100 text-gray-800 rounded-bl-lg'}`}><p className="text-sm">{msg.text}</p></div></div>))}{isLoading && (<div className="flex items-end gap-2 justify-start"><div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0"><Bot size={18} className="text-gray-600"/></div><div className="p-3 bg-gray-100 rounded-2xl rounded-bl-lg"><div className="flex items-center gap-1"><span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-0"></span><span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span><span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span></div></div></div>)}<div ref={messagesEndRef} /></div><footer className="p-4 border-t"><div className="flex items-center gap-2"><input type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Nhập câu hỏi của bạn..." className="flex-grow bg-gray-100 border-transparent focus:ring-pink-500 focus:border-pink-500 rounded-full py-2 px-4" /><button onClick={handleSendMessage} disabled={isLoading || !userInput.trim()} className="w-10 h-10 bg-pink-500 text-white rounded-full flex items-center justify-center flex-shrink-0 disabled:bg-gray-300"><Send size={20} /></button></div></footer></div></div>); };
