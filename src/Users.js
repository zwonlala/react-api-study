import React, { useState } from "react";
import axios from "axios";
import useAsync from "./useAsync";
import User from "./User";

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
  //이번에 새로 추가한 skip 파라미터 값을 ~로 설정해주면, 처음 렌더링할때의 요청은 생략하는 것임
  const [state, refetch] = useAsync(getUsers, [], true);
  const [userId, setUserId] = useState(null);
  //User 컴포넌트에 id 값 설정해주기 위한 훅

  const { loading, data: users, error } = state;

  if (loading) return <div>로딩중...</div>;
  if (error) return <div>에러가 발생했습니다...</div>;
  if (!users) return <button onClick={refetch}>불러오기</button>;
  //아무것도 없을때 return null 해주는 것이 아니라 버튼을 리턴해, 사용자가 버튼을 누르면 데이터를 요청하게 수정

  return (
    <>
      <ul>
        {users.map((user) => (
          <li key={user.id} onClick={() => setUserId(user.id)}>
            {user.username} ({user.name})
          </li>
        ))}
      </ul>
      <button onClick={refetch}>새로고침</button>
      {userId && <User id={userId} />}
      {/*userId 값이 존재하면 User 컴포넌트 출력*/}
    </>
  );
}

export default Users;
