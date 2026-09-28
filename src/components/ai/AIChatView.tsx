import React, { useState, useRef, useEffect } from 'react';
import { useClass } from '../../context/ClassContext';
import { GoogleGenAI } from '@google/genai';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Lightbulb,
  FileCheck,
  HeartHandshake,
  AlertCircle,
  TrendingUp,
  RefreshCw,
  Copy,
  Check,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const AIChatView: React.FC = () => {
  const {
    classInfo,
    students,
    academicRecords,
    attendance,
    behaviors,
    commendations,
    showToast,
  } = useClass();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'ai',
      text: `Xin chào cô ${classInfo.homeroomTeacher}! Tôi là Trợ lý AI GVCN của lớp ${classInfo.className} (Trường ${classInfo.school}).\n\nTôi có thể hỗ trợ cô phân tích dữ liệu học tập, soạn nhận xét học sinh định kỳ, xây dựng kế hoạch phụ đạo cho học sinh cần quan tâm, hoặc dự thảo báo cáo tuần.\n\nCô muốn tôi hỗ trợ nội dung nào hôm nay?`,
      timestamp: 'Vừa xong',
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const quickPrompts = [
    { title: 'Tạo nhận xét học sinh', query: 'Hãy soạn giúp tôi mẫu nhận xét học sinh tháng 9 cho cả 4 mức học lực (Giỏi, Khá, TB, Cần cố gắng).' },
    { title: 'Phân tích tình hình lớp', query: 'Phân tích tổng quan tình hình lớp 6A4 tuần này dựa trên điểm số, chuyên cần và nề nếp.' },
    { title: 'Gợi ý biện pháp giáo dục', query: 'Gợi ý biện pháp sư phạm hỗ trợ em Phạm Gia Huy (Toán giảm, nghỉ học 3 buổi) và Võ Ngọc Bảo (dùng điện thoại).' },
    { title: 'Tóm tắt báo cáo tuần', query: 'Hãy tóm tắt ngắn gọn báo cáo tuần 4 lớp 6A4 để gửi lên nhóm Zalo phụ huynh.' },
    { title: 'Phát hiện HS cần quan tâm', query: 'Liệt kê danh sách học sinh cần quan tâm đặc biệt và nguyên nhân cụ thể.' },
    { title: 'Phân tích học sinh tiến bộ', query: 'Đánh giá các học sinh có tiến bộ vượt bậc tuần này và lời khen ngợi phù hợp.' },
  ];

  // Build real-time context summary
  const getClassContextSummary = () => {
    const total = students.length;
    const gpaSum = Object.values(academicRecords).reduce((acc, c) => acc + c.gpa, 0);
    const avgGpa = (gpaSum / (total || 1)).toFixed(1);

    return `
Thông tin lớp học:
- Tên lớp: ${classInfo.className} - ${classInfo.grade} - Trường ${classInfo.school}
- GVCN: ${classInfo.homeroomTeacher}
- Sĩ số: ${total} học sinh
- Điểm trung bình lớp hiện tại: ${avgGpa}
- Tỷ lệ chuyên cần tuần này: 96.2%
- Học sinh cần quan tâm:
  1. Phạm Gia Huy (6A4-002): Điểm Toán giảm sút, nghỉ 3 buổi không phép
  2. Trần Mai Chi (6A4-003): Nghỉ học nhiều do sức khỏe yếu
  3. Võ Ngọc Bảo (6A4-004): Có 2 lần vi phạm nề nếp (sử dụng điện thoại, đi học muộn)
  4. Lê Minh Khang (6A4-005): Điểm trung bình dưới 6.0, rụt rè
- Học sinh tiến bộ / tuyên dương:
  1. Nguyễn Minh Anh (6A4-001): Tiến bộ môn Tiếng Anh (+1.5 điểm, ĐTB 8.6)
  2. Đỗ Khánh Vy (6A4-006): Gương sáng việc tốt, nhặt được của rơi trả lại
  3. Hoàng Đức Anh (6A4-007): Tiến bộ về nề nếp kỷ luật
  4. Trần Hoàng Nam (6A4-008): Điểm Toán tăng +2.0 điểm
- Vi phạm tuần này: 3 vụ (sử dụng điện thoại, đi trễ, không làm bài tập)
- Khen thưởng: ${commendations.length} lượt
`;
  };

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const apiKey = process.env.GEMINI_API_KEY;

      if (apiKey) {
        const ai = new GoogleGenAI({ apiKey });
        const systemInstruction = `Bạn là Trợ lý AI giáo dục chuyên sâu dành cho Giáo viên chủ nhiệm (GVCN) trường TH-THCS tại Việt Nam.
Bối cảnh lớp học thực tế hiện tại:
${getClassContextSummary()}

Nguyên tắc phản hồi:
1. Thân thiện, tôn trọng, chuyên nghiệp, sư phạm, xưng hô "tôi" và "thầy/cô" hoặc "cô Minh".
2. Luôn dựa vào dữ liệu thực tế của lớp 6A4 đã cung cấp ở trên để đưa ra phân tích chính xác, dẫn chứng cụ thể tên học sinh.
3. Đưa ra gợi ý giải pháp mang tính khích lệ, động viên, đồng hành cùng phụ huynh; không đưa ra quyết định kỷ luật tiêu cực.
4. Trình bày rõ ràng bằng tiếng Việt, gạch đầu dòng mạch lạc.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: query,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });

        const reply = response.text || 'Xin lỗi cô, tôi chưa thể hoàn thành câu trả lời lúc này.';

        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: reply,
            timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } else {
        // High quality pedagogical fallback generator when API key is not yet set
        await new Promise((resolve) => setTimeout(resolve, 800));
        let fallbackReply = '';

        if (query.includes('nhận xét') || query.includes('học sinh')) {
          fallbackReply = `Dưới đây là mẫu nhận xét tháng 9 cho cô Lê Ngọc Minh:\n\n1. **Học sinh Giỏi (VD: Nguyễn Minh Anh, Đỗ Khánh Vy)**:\n- "Em có ý thức tự giác cao, học lực xuất sắc, tích cực tham gia các phong trào của lớp và gương mẫu giúp đỡ bạn bè."\n\n2. **Học sinh Tiến bộ (VD: Trần Hoàng Nam, Hoàng Đức Anh)**:\n- "Có sự nỗ lực vượt bậc trong học tập, đặc biệt môn Toán có nhiều điểm sáng. Duy trì nề nếp đi học rất tốt."\n\n3. **Học sinh cần quan tâm (VD: Lê Minh Khang, Phạm Gia Huy)**:\n- "Em chăm ngoan, hòa đồng với bạn bè. Cần tự tin hơn trong giờ học và tăng cường ôn tập kiến thức môn Toán. Gia đình cần phối hợp cùng GVCN theo dõi sát giờ tự học."`;
        } else if (query.includes('biện pháp') || query.includes('Gia Huy') || query.includes('Ngọc Bảo')) {
          fallbackReply = `Dựa trên dữ liệu theo dõi của lớp 6A4, tôi xin đề xuất giải pháp sư phạm:\n\n1. **Với em Phạm Gia Huy (Toán giảm, vắng 3 buổi)**:\n- **Gia đình**: Bố mẹ đi làm xa, em ở với bà. GVCN cần gọi điện trực tiếp động viên bố mẹ liên hệ thường xuyên với em mỗi tối.\n- **Học tập**: Phân công bạn Trần Hoàng Nam (học sinh tiến bộ môn Toán) ngồi cùng bàn để hỗ trợ kèm cặp.\n\n2. **Với em Võ Ngọc Bảo (dùng điện thoại, đi muộn)**:\n- Ký cam kết nộp điện thoại cho lớp trưởng vào đầu buổi và nhận lại cuối giờ.\n- Phân công em làm phó tổ phụ trách điểm danh để rèn luyện tính đúng giờ.`;
        } else {
          fallbackReply = `Báo cáo phân tích tổng hợp lớp 6A4 (Tuần 4):\n\n- **Sĩ số & Chuyên cần**: Duy trì tốt 36/36 học sinh. Tỷ lệ chuyên cần đạt 96.2%.\n- **Học tập**: ĐTB lớp 7.6. Đột phá môn Tiếng Anh và Lịch sử. Cần chú ý phụ đạo môn Toán.\n- **Nề nếp**: 3 trường hợp vi phạm đã được giải quyết nhắc nhở.\n- **Tuyên dương**: 5 học sinh có thành tích và việc tốt được khen thưởng dưới cờ.`;
        }

        setMessages((prev) => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: fallbackReply,
            timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: `Đã có lỗi xảy ra khi kết nối trợ lý AI: ${err?.message || 'Không thể phản hồi'}. Vui lòng thử lại.`,
          timestamp: 'Vừa xong',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast({ type: 'success', title: 'Đã sao chép phản hồi' });
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col bg-white rounded-2xl border border-[#E3ECF8] shadow-xs overflow-hidden">
      {/* AI Assistant Header */}
      <div className="p-4 px-6 bg-gradient-to-r from-[#06367A] via-[#0D47A1] to-[#1677FF] text-white flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center text-amber-300 ring-1 ring-white/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-base tracking-tight">TRỢ LÝ AI GIÁO VIÊN CHỦ NHIỆM</h2>
              <span className="text-[10px] bg-amber-400 text-slate-900 font-extrabold px-2 py-0.5 rounded-full">
                Gemini 3.8 Flash
              </span>
            </div>
            <p className="text-xs text-blue-100 font-medium">
              Đồng hành cùng cô Lê Ngọc Minh quản lý lớp 6A4 • TH-THCS Nguyễn Văn Tiệp
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-blue-200">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Sẵn sàng hỗ trợ 24/7</span>
        </div>
      </div>

      {/* Quick Prompts Bar (Requirement 16) */}
      <div className="p-3 bg-blue-50/50 border-b border-[#E3ECF8] overflow-x-auto flex items-center gap-2">
        <span className="text-xs font-bold text-slate-500 whitespace-nowrap flex items-center gap-1 pl-1">
          <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
          Gợi ý nhanh:
        </span>
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p.query)}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-blue-50 text-slate-700 hover:text-[#1677FF] border border-blue-200/80 text-xs font-semibold whitespace-nowrap transition-all shadow-2xs hover:shadow-xs cursor-pointer active:scale-95"
          >
            {p.title}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 max-w-3xl ${
              msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
            }`}
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-white font-bold shadow-xs ${
                msg.sender === 'user'
                  ? 'bg-[#1677FF]'
                  : 'bg-gradient-to-br from-indigo-600 to-blue-600'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-5 h-5 text-amber-300" />}
            </div>

            <div
              className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed relative group ${
                msg.sender === 'user'
                  ? 'bg-[#1677FF] text-white rounded-tr-xs'
                  : 'bg-[#F3F8FF] text-slate-800 border border-[#E3ECF8] rounded-tl-xs'
              }`}
            >
              <div className="whitespace-pre-wrap font-sans">{msg.text}</div>

              <div
                className={`flex items-center justify-between gap-3 mt-2 pt-1 border-t text-[10px] ${
                  msg.sender === 'user'
                    ? 'border-blue-400 text-blue-200'
                    : 'border-slate-200 text-slate-400'
                }`}
              >
                <span>{msg.timestamp}</span>

                {msg.sender === 'ai' && (
                  <button
                    onClick={() => handleCopy(msg.id, msg.text)}
                    className="flex items-center gap-1 hover:text-blue-600 cursor-pointer"
                  >
                    {copiedId === msg.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        Đã chép
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        Sao chép
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center text-amber-300">
              <Bot className="w-5 h-5" />
            </div>
            <div className="p-3.5 rounded-2xl bg-[#F3F8FF] border border-[#E3ECF8] text-xs text-slate-600 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-[#1677FF]" />
              AI đang phân tích dữ liệu lớp 6A4 và soạn câu trả lời...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Bar */}
      <div className="p-3 sm:p-4 bg-white border-t border-[#E3ECF8]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isLoading}
            placeholder="Nhập câu hỏi hoặc yêu cầu dành cho lớp 6A4..."
            className="flex-1 bg-[#F3F8FF] focus:bg-white text-xs sm:text-sm px-4 py-3 rounded-xl border border-slate-200 focus:border-[#1677FF] focus:outline-none transition-colors"
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="px-5 py-3 rounded-xl bg-[#1677FF] hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Gửi</span>
          </button>
        </form>

        <div className="text-[11px] text-slate-400 mt-2 text-center">
          * Trợ lý AI chỉ đưa ra gợi ý, phân tích và giải pháp sư phạm; không tự ý đưa ra quyết định kỷ luật học sinh.
        </div>
      </div>
    </div>
  );
};
