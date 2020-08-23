import React, { useState, useEffect } from "react";
import axios from "axios";

function Users() {
  //1.요청의 결과 상태 관리
  const [users, setUsers] = useState(null);

  //2.로딩 상태 관리
  //loading 값은 현재 데이터를 로딩 중인지 아닌지 알려주는 값
  const [loading, setLoading] = useState(false);

  //3.Error 상태 관리
  //에러가 발생하면 error에 값이 담길 것임!
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setUsers(null);
      setError(null); //user와 error 값을 초기화
      setLoading(true);

      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/users/"
      );
      //결과값 조회하기 위해서는 'response.data'값 조회하면 됨
      setUsers(response.data);
    } catch (e) {
      //에러가 발생하면 발생한 e 값으로 Error 설정!
      setError(e);
      console.log(e.response.status);
    }
    //이 모든게 다 끝나면, 로딩이 끝났다고 다시 알려줘야 함!
    setLoading(false);
  };

  //그리고 컴포넌트가 처음 렌더링 될 때, axios 사용하여 api를 요청하도록 useEffect 사용하여 구현
  useEffect(() => {
    //위에서 만든 fetchUsers 함수 호출해 줌!
    fetchUsers();
  }, []);

  //이제는 세가지 상태에 따라 다른 결과물을 렌더링 할 것임!

  if (loading) return <div>로딩중...</div>;
  if (error) return <div>에러가 발생했습니다...</div>;
  if (!users) return null;

  //여기서부턴 user가 정상적으로 아무 문제 없이 온 상황!

  return (
    <>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.username} ({user.name})
          </li>
        ))}
      </ul>
      <button onClick={fetchUsers}>새로고침</button>
    </>
  );
}

export default Users;
