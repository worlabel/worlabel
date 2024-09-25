import { http, HttpResponse } from 'msw';
import { MemberResponse } from '@/types';

export const memberHandlers = [
  http.get('/api/members', ({ params }) => {
    const keyword = Array.isArray(params.keyword) ? params.keyword[0] : params.keyword;

    const members: MemberResponse[] = [
      { id: 1, nickname: 'john_doe', profileImage: 'john.jpg', email: 'john@example.com' },
      { id: 2, nickname: 'jane_doe', profileImage: 'jane.jpg', email: 'jane@example.com' },
      { id: 3, nickname: 'sam_smith', profileImage: 'sam.jpg', email: 'sam@example.com' },
    ];

    const filteredMembers = members.filter((member) => member.email.includes(keyword || ''));

    return HttpResponse.json(filteredMembers);
  }),
];
