import type { ConversationResponse, ChatMessageResponse, ParticipantInfo } from "@/api-client/models";

// Mock participants - Admin and various customers
export const mockParticipants: ParticipantInfo[] = [
  {
    userId: 1,
    email: "admin@adamstore.com",
    name: "Admin Support",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
  },
  {
    userId: 12345,
    email: "user12345@gmail.com",
    name: "Người dùng 12345",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  },
  {
    userId: 12346,
    email: "customer12346@yahoo.com",
    name: "Người dùng 12346",
    avatarUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
  },
  {
    userId: 12347,
    email: "buyer12347@hotmail.com",
    name: "Người dùng 12347",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
  },
  {
    userId: 12348,
    email: "shopper12348@gmail.com",
    name: "Người dùng 12348",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
  },
  {
    userId: 12349,
    email: "client12349@outlook.com",
    name: "Người dùng 12349",
    avatarUrl: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face"
  },
  {
    userId: 12350,
    email: "customer12350@gmail.com",
    name: "Người dùng 12350",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face"
  },
  {
    userId: 12351,
    email: "user12351@yahoo.com",
    name: "Người dùng 12351",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
  },
  {
    userId: 12352,
    email: "buyer12352@gmail.com",
    name: "Người dùng 12352",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
  },
  {
    userId: 12353,
    email: "customer12353@hotmail.com",
    name: "Người dùng 12353",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
  }
];

// Mock conversations - Admin chatting with customers
export const mockConversations: ConversationResponse[] = [
  {
    id: "conv-1",
    type: "DIRECT",
    participantsHash: "hash-1",
    conversationAvatar: mockParticipants[1].avatarUrl,
    conversationName: undefined, // Will show participant name
    participants: [mockParticipants[0], mockParticipants[1]],
    createdDate: "2024-01-20T10:30:00Z",
    modifiedDate: "2024-01-20T14:45:00Z"
  },
  {
    id: "conv-2",
    type: "DIRECT",
    participantsHash: "hash-2",
    conversationAvatar: mockParticipants[2].avatarUrl,
    conversationName: undefined,
    participants: [mockParticipants[0], mockParticipants[2]],
    createdDate: "2024-01-20T09:15:00Z",
    modifiedDate: "2024-01-20T16:20:00Z"
  },
  {
    id: "conv-3",
    type: "DIRECT",
    participantsHash: "hash-3",
    conversationAvatar: mockParticipants[3].avatarUrl,
    conversationName: undefined,
    participants: [mockParticipants[0], mockParticipants[3]],
    createdDate: "2024-01-20T08:00:00Z",
    modifiedDate: "2024-01-20T11:30:00Z"
  },
  {
    id: "conv-4",
    type: "DIRECT",
    participantsHash: "hash-4",
    conversationAvatar: mockParticipants[4].avatarUrl,
    conversationName: undefined,
    participants: [mockParticipants[0], mockParticipants[4]],
    createdDate: "2024-01-20T13:45:00Z",
    modifiedDate: "2024-01-20T15:10:00Z"
  },
  {
    id: "conv-5",
    type: "DIRECT",
    participantsHash: "hash-5",
    conversationAvatar: mockParticipants[5].avatarUrl,
    conversationName: undefined,
    participants: [mockParticipants[0], mockParticipants[5]],
    createdDate: "2024-01-20T11:20:00Z",
    modifiedDate: "2024-01-20T13:55:00Z"
  },
  {
    id: "conv-6",
    type: "DIRECT",
    participantsHash: "hash-6",
    conversationAvatar: mockParticipants[6].avatarUrl,
    conversationName: undefined,
    participants: [mockParticipants[0], mockParticipants[6]],
    createdDate: "2024-01-20T07:30:00Z",
    modifiedDate: "2024-01-20T17:20:00Z"
  },
  {
    id: "conv-7",
    type: "DIRECT",
    participantsHash: "hash-7",
    conversationAvatar: mockParticipants[7].avatarUrl,
    conversationName: undefined,
    participants: [mockParticipants[0], mockParticipants[7]],
    createdDate: "2024-01-20T16:45:00Z",
    modifiedDate: "2024-01-20T18:10:00Z"
  },
  {
    id: "conv-8",
    type: "DIRECT",
    participantsHash: "hash-8",
    conversationAvatar: mockParticipants[8].avatarUrl,
    conversationName: undefined,
    participants: [mockParticipants[0], mockParticipants[8]],
    createdDate: "2024-01-20T12:15:00Z",
    modifiedDate: "2024-01-20T19:30:00Z"
  },
  {
    id: "conv-9",
    type: "DIRECT",
    participantsHash: "hash-9",
    conversationAvatar: mockParticipants[9].avatarUrl,
    conversationName: undefined,
    participants: [mockParticipants[0], mockParticipants[9]],
    createdDate: "2024-01-20T14:20:00Z",
    modifiedDate: "2024-01-20T20:15:00Z"
  }
];

// Mock messages for different conversations - Customer support chats
export const mockMessages: Record<string, ChatMessageResponse[]> = {
  "conv-1": [
    {
      id: "msg-1-1",
      conversationId: "conv-1",
      me: false,
      message: "Chào admin, em có vấn đề với đơn hàng vừa đặt ạ. Trạng thái hiển thị đã giao nhưng em chưa nhận được hàng.",
      sender: mockParticipants[1],
      createdDate: "2024-01-20T10:00:00Z"
    },
    {
      id: "msg-1-2",
      conversationId: "conv-1",
      me: true,
      message: "Chào bạn! Mình rất tiếc khi nghe về vấn đề giao hàng này. Mình sẽ hỗ trợ bạn ngay. Bạn có thể cung cấp mã đơn hàng được không?",
      sender: mockParticipants[0],
      createdDate: "2024-01-20T10:02:00Z"
    },
    {
      id: "msg-1-3",
      conversationId: "conv-1",
      me: false,
      message: "Dạ, mã đơn hàng là #AS-2024-001234 ạ",
      sender: mockParticipants[1],
      createdDate: "2024-01-20T10:03:00Z"
    },
    {
      id: "msg-1-4",
      conversationId: "conv-1",
      me: true,
      message: "Cảm ơn bạn! Mình đã thấy đơn hàng của bạn rồi. Mình sẽ liên hệ với đối tác vận chuyển và phản hồi lại trong vòng 30 phút nhé.",
      sender: mockParticipants[0],
      createdDate: "2024-01-20T10:05:00Z"
    },
    {
      id: "msg-1-5",
      conversationId: "conv-1",
      me: false,
      message: "Dạ cảm ơn admin nhiều ạ! Em sẽ chờ phản hồi.",
      sender: mockParticipants[1],
      createdDate: "2024-01-20T10:06:00Z"
    },
    {
      id: "msg-1-6",
      conversationId: "conv-1",
      me: true,
      message: "Mình đã liên hệ với bên vận chuyển rồi. Hàng của bạn đang ở bưu cục gần nhà, sẽ được giao lại vào chiều nay. Bạn để ý điện thoại nhé!",
      sender: mockParticipants[0],
      createdDate: "2024-01-20T10:35:00Z"
    }
  ],
  "conv-2": [
    {
      id: "msg-2-1",
      conversationId: "conv-2",
      me: false,
      message: "Admin ơi, em muốn đổi trả sản phẩm ạ. Áo em mua không vừa size.",
      sender: mockParticipants[2],
      createdDate: "2024-01-20T09:00:00Z"
    },
    {
      id: "msg-2-2",
      conversationId: "conv-2",
      me: true,
      message: "Chào bạn! Mình sẽ hỗ trợ bạn đổi trả ngay. Bạn muốn đổi trả sản phẩm nào vậy?",
      sender: mockParticipants[0],
      createdDate: "2024-01-20T09:02:00Z"
    },
    {
      id: "msg-2-3",
      conversationId: "conv-2",
      me: false,
      message: "Dạ, em mua áo len màu xanh size M tuần trước nhưng mặc nhỏ quá ạ.",
      sender: mockParticipants[2],
      createdDate: "2024-01-20T09:05:00Z"
    },
    {
      id: "msg-2-4",
      conversationId: "conv-2",
      me: true,
      message: "Không vấn đề gì! Mình có thể hỗ trợ bạn đổi size. Bạn muốn đổi sang size L hay muốn hoàn tiền?",
      sender: mockParticipants[0],
      createdDate: "2024-01-20T09:07:00Z"
    },
    {
      id: "msg-2-5",
      conversationId: "conv-2",
      me: false,
      message: "Em muốn đổi sang size L ạ. Cảm ơn admin!",
      sender: mockParticipants[2],
      createdDate: "2024-01-20T09:08:00Z"
    },
    {
      id: "msg-2-6",
      conversationId: "conv-2",
      me: true,
      message: "OK! Mình đã tạo đơn đổi hàng cho bạn. Shipper sẽ đến lấy hàng cũ và giao hàng mới trong 2-3 ngày tới nhé.",
      sender: mockParticipants[0],
      createdDate: "2024-01-20T09:10:00Z"
    }
  ],
  "conv-3": [
    {
      id: "msg-3-1",
      conversationId: "conv-3",
      me: false,
      message: "Chào shop! Em muốn hỏi về gói thành viên VIP ạ. Có những quyền lợi gì vậy?",
      sender: mockParticipants[3],
      createdDate: "2024-01-20T08:00:00Z"
    },
    {
      id: "msg-3-2",
      conversationId: "conv-3",
      me: true,
      message: "Chào bạn! Gói VIP của shop bao gồm: miễn phí ship toàn quốc, ưu tiên mua hàng sale, và hỗ trợ 24/7 nhé!",
      sender: mockParticipants[0],
      createdDate: "2024-01-20T08:02:00Z"
    },
    {
      id: "msg-3-3",
      conversationId: "conv-3",
      me: false,
      message: "Nghe hay đấy! Phí hàng tháng bao nhiêu vậy admin?",
      sender: mockParticipants[3],
      createdDate: "2024-01-20T08:05:00Z"
    },
    {
      id: "msg-3-4",
      conversationId: "conv-3",
      me: true,
      message: "Chỉ 199k/tháng thôi bạn! Hiện tại shop đang có chương trình dùng thử 30 ngày miễn phí cho khách hàng mới đăng ký đấy!",
      sender: mockParticipants[0],
      createdDate: "2024-01-20T08:07:00Z"
    },
    {
      id: "msg-3-5",
      conversationId: "conv-3",
      me: false,
      message: "Tuyệt vời! Em đăng ký thử nghiệm như thế nào ạ?",
      sender: mockParticipants[3],
      createdDate: "2024-01-20T08:10:00Z"
    },
    {
      id: "msg-3-6",
      conversationId: "conv-3",
      me: true,
      message: "Mình sẽ gửi link đăng ký cho bạn ngay. Bạn chỉ cần điền thông tin là có thể sử dụng luôn!",
      sender: mockParticipants[0],
      createdDate: "2024-01-20T08:12:00Z"
    }
  ],
  "conv-4": [
    {
      id: "msg-4-1",
      conversationId: "conv-4",
      me: false,
      message: "Admin ơi, em không đăng nhập được tài khoản. Nó báo sai mật khẩu hoài ạ.",
      sender: mockParticipants[4],
      createdDate: "2024-01-20T13:45:00Z"
    },
    {
      id: "msg-4-2",
      conversationId: "conv-4",
      me: true,
      message: "Mình sẽ hỗ trợ bạn reset lại mật khẩu ngay. Bạn cho mình biết email đăng ký tài khoản nhé!",
      sender: mockParticipants[0],
      createdDate: "2024-01-20T13:47:00Z"
    },
    {
      id: "msg-4-3",
      conversationId: "conv-4",
      me: false,
      message: "Dạ email của em là shopper12348@gmail.com ạ",
      sender: mockParticipants[4],
      createdDate: "2024-01-20T13:48:00Z"
    },
    {
      id: "msg-4-4",
      conversationId: "conv-4",
      me: true,
      message: "OK! Mình đã gửi link đặt lại mật khẩu về email của bạn rồi. Bạn check email và làm theo hướng dẫn nhé!",
      sender: mockParticipants[0],
      createdDate: "2024-01-20T13:50:00Z"
    },
    {
      id: "msg-4-5",
      conversationId: "conv-4",
      me: false,
      message: "Em đã reset thành công rồi ạ! Cảm ơn admin hỗ trợ nhiệt tình!",
      sender: mockParticipants[4],
      createdDate: "2024-01-20T14:05:00Z"
    }
  ],
  "conv-5": [
    {
      id: "msg-5-1",
      conversationId: "conv-5",
      me: false,
      message: "Chào admin! Em nhận được hàng bị hỏng rồi ạ. Shop có thể đổi lại được không?",
      sender: mockParticipants[5],
      createdDate: "2024-01-20T11:20:00Z"
    },
    {
      id: "msg-5-2",
      conversationId: "conv-5",
      me: true,
      message: "Ôi, mình rất xin lỗi về sự cố này! Mình sẽ đổi hàng mới cho bạn ngay. Bạn cho mình biết sản phẩm nào bị hỏng và hỏng như thế nào nhé?",
      sender: mockParticipants[0],
      createdDate: "2024-01-20T11:22:00Z"
    },
    {
      id: "msg-5-3",
      conversationId: "conv-5",
      me: false,
      message: "Dạ, em mua lọ hoa gốm mà bị nứt ở cạnh bên ạ. Có lẽ do vận chuyển.",
      sender: mockParticipants[5],
      createdDate: "2024-01-20T11:25:00Z"
    },
    {
      id: "msg-5-4",
      conversationId: "conv-5",
      me: true,
      message: "Mình hiểu cảm giác bực mình của bạn. Mình sẽ gửi sản phẩm mới hôm nay, bạn giữ lại cái cũ không cần trả lại đâu nhé!",
      sender: mockParticipants[0],
      createdDate: "2024-01-20T11:27:00Z"
    },
    {
      id: "msg-5-5",
      conversationId: "conv-5",
      me: false,
      message: "Wao, dịch vụ tuyệt vời quá! Cảm ơn admin rất nhiều ạ!",
      sender: mockParticipants[5],
      createdDate: "2024-01-20T11:30:00Z"
    }
  ],
  "conv-6": [
    {
      id: "msg-6-1",
      conversationId: "conv-6",
      me: false,
      message: "Chào shop! Hiện tại có chương trình giảm giá nào không ạ?",
      sender: mockParticipants[6],
      createdDate: "2024-01-20T07:30:00Z"
    },
    {
      id: "msg-6-2",
      conversationId: "conv-6",
      me: true,
      message: "Chào bạn! Hiện tại shop đang có chương trình giảm 20% cho tất cả sản phẩm điện tử đấy! Mình gửi mã giảm giá cho bạn nhé?",
      sender: mockParticipants[0],
      createdDate: "2024-01-20T07:32:00Z"
    },
    {
      id: "msg-6-3",
      conversationId: "conv-6",
      me: false,
      message: "Tuyệt vời! Em đang muốn mua laptop ạ.",
      sender: mockParticipants[6],
      createdDate: "2024-01-20T07:35:00Z"
    },
    {
      id: "msg-6-4",
      conversationId: "conv-6",
      me: true,
      message: "Mã giảm giá: LAPTOP20 - áp dụng cho tất cả laptop. Bạn có thể dùng ngay khi thanh toán nhé!",
      sender: mockParticipants[0],
      createdDate: "2024-01-20T07:37:00Z"
    }
  ],
  "conv-7": [
    {
      id: "msg-7-1",
      conversationId: "conv-7",
      me: false,
      message: "Admin ơi, đơn hàng của em khi nào ship vậy? Em đặt 3 hôm rồi mà chưa thấy cập nhật gì.",
      sender: mockParticipants[7],
      createdDate: "2024-01-20T16:45:00Z"
    },
    {
      id: "msg-7-2",
      conversationId: "conv-7",
      me: true,
      message: "Để mình check trạng thái đơn hàng cho bạn nhé. Bạn cung cấp mã đơn hàng được không?",
      sender: mockParticipants[0],
      createdDate: "2024-01-20T16:47:00Z"
    },
    {
      id: "msg-7-3",
      conversationId: "conv-7",
      me: false,
      message: "Dạ mã đơn hàng #AS-2024-005678 ạ",
      sender: mockParticipants[7],
      createdDate: "2024-01-20T16:48:00Z"
    }
  ],
  "conv-8": [
    {
      id: "msg-8-1",
      conversationId: "conv-8",
      me: false,
      message: "Chào admin! Em muốn hỏi về chính sách bảo hành sản phẩm ạ.",
      sender: mockParticipants[8],
      createdDate: "2024-01-20T12:15:00Z"
    },
    {
      id: "msg-8-2",
      conversationId: "conv-8",
      me: true,
      message: "Chào bạn! Tất cả sản phẩm của shop đều có bảo hành 12 tháng. Bạn quan tâm sản phẩm nào vậy?",
      sender: mockParticipants[0],
      createdDate: "2024-01-20T12:17:00Z"
    },
    {
      id: "msg-8-3",
      conversationId: "conv-8",
      me: false,
      message: "Em muốn mua điện thoại iPhone 15 ạ. Bảo hành có bao gồm rơi vỡ không?",
      sender: mockParticipants[8],
      createdDate: "2024-01-20T12:20:00Z"
    }
  ],
  "conv-9": [
    {
      id: "msg-9-1",
      conversationId: "conv-9",
      me: false,
      message: "Admin có thể tư vấn giúp em không ạ? Em đang phân vân giữa 2 sản phẩm.",
      sender: mockParticipants[9],
      createdDate: "2024-01-20T14:20:00Z"
    },
    {
      id: "msg-9-2",
      conversationId: "conv-9",
      me: true,
      message: "Tất nhiên rồi! Mình sẽ tư vấn chi tiết cho bạn. Bạn đang phân vân giữa 2 sản phẩm nào vậy?",
      sender: mockParticipants[0],
      createdDate: "2024-01-20T14:22:00Z"
    },
    {
      id: "msg-9-3",
      conversationId: "conv-9",
      me: false,
      message: "Em đang chọn giữa MacBook Air M2 và MacBook Pro M3 ạ. Không biết nên chọn cái nào.",
      sender: mockParticipants[9],
      createdDate: "2024-01-20T14:25:00Z"
    }
  ]
};

// Helper functions for mock data
export const getMockConversations = (): ConversationResponse[] => {
  return mockConversations;
};

export const getMockMessages = (conversationId: string): ChatMessageResponse[] => {
  return mockMessages[conversationId] || [];
};

export const searchMockConversations = (searchTerm: string): ConversationResponse[] => {
  if (!searchTerm.trim()) return mockConversations;
  
  return mockConversations.filter(conv => 
    conv.conversationName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.participants?.some(p => p.name?.toLowerCase().includes(searchTerm.toLowerCase()))
  );
};

export const searchMockMessages = (conversationId: string, searchTerm: string): ChatMessageResponse[] => {
  const messages = mockMessages[conversationId] || [];
  if (!searchTerm.trim()) return messages;
  
  return messages.filter(msg => 
    msg.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.sender?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

export const deleteMockMessage = (messageId: string): boolean => {
  for (const conversationId in mockMessages) {
    const messageIndex = mockMessages[conversationId].findIndex(msg => msg.id === messageId);
    if (messageIndex !== -1) {
      mockMessages[conversationId].splice(messageIndex, 1);
      return true;
    }
  }
  return false;
};


