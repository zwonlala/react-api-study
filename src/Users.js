import React from "react";
import axios from "axios";
import useAsync from "./useAsync";

//원하는 데이터를 받아오는 함수
async function getUsers() {
  const response = await axios.get(
    "https://jsonplaceholder.typicode.com/users/"
  );
  return response.data;
}

function Users() {
  //위에서 정의한 getUsers 함수를 인자로 넣어 만든 useAsync 커스텀 훅을 사용
  //그리고 deps 배열은 빈 배열 -> 컴포넌트가 처음 렌더링 될때 호출하겠다(넣어도 되고 생락해도 되고)
  const [state, refetch] = useAsync(getUsers, []);
  const { loading, data: users, error } = state;

  if (loading) return <div>로딩중...</div>;
  if (error) return <div>에러가 발생했습니 다...</div>;
  if (!users) return null;

  return (
    <>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.username} ({user.name})
          </li>
        ))}
      </ul>
      <button onClick={refetch}>새로고침</button>
    </>
  );
}

export default Users;
