// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import useAuthStore from '@/stores/useAuthStore';
// import { reissueToken } from '@/api/authApi';
// import { useEffect } from 'react';

// import useProfileQuery from '@/queries/auth/useProfileQuery';

// export const useReissueToken = () => {
//   const queryClient = useQueryClient();
//   const { setLoggedIn } = useAuthStore();

//   return useMutation({
//     mutationFn: reissueToken,
//     onSuccess: (data) => {
//       setLoggedIn(true, data.accessToken);
//       queryClient.invalidateQueries({ queryKey: ['profile'] });
//     },
//   });
// };

// export const useProfile = () => {
//   const { setProfile } = useAuthStore();
//   const query = useProfileQuery();

//   // TODO: query.data가 변경될 때마다 setProfile을 호출하여 profile 업데이트, useEffect 제거
//   useEffect(() => {
//     setProfile(query.data);
//   }, [query.data, setProfile]);

//   return query;
// };

// export const useFetchProfile = () => {
//   const { setProfile } = useAuthStore();
//   const query = useProfileQuery();
//   if (query.data) {
//     setProfile(query.data);
//   }
// };
