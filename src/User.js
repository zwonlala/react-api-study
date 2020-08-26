import React from "react";
import axios from "axios";
import useAsync from "./useAsync";

async function getUser(id) {
  const response = await axios.get(
    `https://jsonplaceholder.typicode.com/users/${id}`
  );
  return response.data;
}

function User({ id }) {
  const [state] = useAsync(getUser(id), [id]);
  //이곳에서 refetch를 사용할 일이 없어서 state만 입력받고,
  //id 값이 바뀔때마다 함수를 호출할 거니, deps로 [id] 값 전달
  const { loading, data: user, error } = state;

  if (error) console.log(error);
  if (loading) return <div>로딩중....</div>;
  if (error) return <div>에러가 발생했습니다.</div>;
  if (!user) return null;

  return (
    <div>
      <h2>{user.username}</h2>
      <p>
        <b>E-mail: </b>
        {user.email}
      </p>
    </div>
  );
}

export default User;
