import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { modifyItinerary } from '../api';

export default function ItineraryChatbot({ trip, onItineraryUpdate }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'bot',
            text: `Hi! I'm your travel assistant for ${trip?.destination || 'your trip'}. Want to change your hotel, swap an activity, or adjust the schedule? Just tell me what you'd like to modify!`
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleSend = async () => {
        const userMessage = input.trim();
        if (!userMessage || loading) return;

        setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
        setInput('');
        setLoading(true);

        try {
            const res = await modifyItinerary({
                destination: trip.destination,
                days: trip.days,
                currency: trip.currency || 'USD',
                budget: trip.budget || 0,
                interests: trip.interests || [],
                current_itinerary: trip.itinerary,
                user_message: userMessage,
            });

            const { reply, updated_itinerary } = res.data;

            setMessages(prev => [...prev, { role: 'bot', text: reply }]);

            if (updated_itinerary && Array.isArray(updated_itinerary)) {
                onItineraryUpdate(updated_itinerary);
            }
        } catch (err) {
            console.error('Chatbot error:', err);
            setMessages(prev => [...prev, {
                role: 'bot',
                text: 'Sorry, I had trouble processing that request. Please try again.'
            }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {/* Floating Open Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 z-50 bg-vintage-leather text-vintage-paper w-14 h-14 rounded-full shadow-xl flex items-center justify-center hover:bg-vintage-ink hover:scale-110 transition-all duration-300 group"
                    title="Open Travel Assistant"
                >
                    <MessageCircle className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-vintage-accent rounded-full animate-pulse" />
                </button>
            )}

            {/* Chat Panel */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[520px] rounded-2xl shadow-2xl border border-vintage-brass/30 flex flex-col overflow-hidden backdrop-blur-xl bg-vintage-paper/95 animate-in slide-in-from-bottom-4 duration-300">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-vintage-leather text-vintage-paper border-b border-vintage-brass/20">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-vintage-paper/20 flex items-center justify-center">
                                <Bot className="w-4.5 h-4.5" />
                            </div>
                            <div>
                                <p className="font-serif font-bold text-sm leading-tight">Travel Assistant</p>
                                <p className="text-[10px] font-mono opacity-70 tracking-wider">Modify your itinerary</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-7 h-7 rounded-full bg-vintage-paper/10 flex items-center justify-center hover:bg-vintage-paper/25 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex items-end gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                            >
                                {/* Avatar */}
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
                                    msg.role === 'user'
                                        ? 'bg-vintage-sky text-white'
                                        : 'bg-vintage-leather/15 text-vintage-leather'
                                }`}>
                                    {msg.role === 'user'
                                        ? <User className="w-3.5 h-3.5" />
                                        : <Bot className="w-3.5 h-3.5" />
                                    }
                                </div>

                                {/* Bubble */}
                                <div className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                    msg.role === 'user'
                                        ? 'bg-vintage-sky text-white rounded-br-md'
                                        : 'bg-vintage-brass/10 text-vintage-ink border border-vintage-brass/15 rounded-bl-md'
                                }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}

                        {/* Typing indicator */}
                        {loading && (
                            <div className="flex items-end gap-2">
                                <div className="w-7 h-7 rounded-full bg-vintage-leather/15 text-vintage-leather flex items-center justify-center flex-shrink-0">
                                    <Bot className="w-3.5 h-3.5" />
                                </div>
                                <div className="bg-vintage-brass/10 border border-vintage-brass/15 px-4 py-3 rounded-2xl rounded-bl-md">
                                    <div className="flex gap-1.5">
                                        <span className="w-2 h-2 bg-vintage-leather/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <span className="w-2 h-2 bg-vintage-leather/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <span className="w-2 h-2 bg-vintage-leather/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-3 border-t border-vintage-brass/20 bg-vintage-paper/80">
                        <div className="flex items-center gap-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="e.g. Change Hotel XYZ to Hotel ABC..."
                                disabled={loading}
                                className="flex-1 vintage-input !py-2.5 !px-3.5 !text-sm !rounded-xl !border-vintage-brass/25 focus:!border-vintage-leather"
                            />
                            <button
                                onClick={handleSend}
                                disabled={loading || !input.trim()}
                                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 shadow-sm ${
                                    loading || !input.trim()
                                        ? 'bg-vintage-brass/20 text-vintage-ink/30 cursor-not-allowed'
                                        : 'bg-vintage-leather text-vintage-paper hover:bg-vintage-ink hover:scale-105 active:scale-95'
                                }`}
                            >
                                {loading
                                    ? <Loader2 className="w-4 h-4 animate-spin" />
                                    : <Send className="w-4 h-4" />
                                }
                            </button>
                        </div>
                        <p className="text-[9px] font-mono text-vintage-ink/40 mt-1.5 text-center tracking-wide">
                            Changes are applied to your live itinerary
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}
