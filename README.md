### Add 'axios'

**axios란?**

_REST api를 요청할 때 promise 기반으로 처리할 수 있게 해주는 라이브러리_

<br>

> REST api란?

클라이언트와 서버가 소통하는 방식

<br>

**axios 사용방법**

```javascript
//사용자 정보 받아오는 경우
import axios from "axios";

axios.get("/users/1");

//사용자 정보 등록하는 경우
axios.post("/users", {
  username: "sjw",
  name: "jiwonSong",
});
```

<br><br><br>

### JSONPlaceholder

REST api 사용하는 방법 연습할때 [JSONPlaceholder](https://jsonplaceholder.typicode.com/)라는 사이트 사용하여 연습!!

다양한 연습용 api 제공!!

[posts](https://jsonplaceholder.typicode.com/posts), [comments](https://jsonplaceholder.typicode.com/comments), [albums](https://jsonplaceholder.typicode.com/albums) 등 다양한 연습용 api 제공

<br><br><br>

### 컴포넌트에서 데이터 받아오기!

> **`useState`** 와 **`useEffect`** 로 데이터 로딩하기

<br>

api를 요청할 때는 세가지 상태를 관리하는데,

**1. 요청의 결과**  
**2. 로딩 상태**  
**3. 에러**

이렇게 세가지 상태를 관리함!

<br>

위에서 말한 세가지 상태에 대해 **`useState`** Hook을 사용하여 이렇게 처리하고

```javascript
//1.요청의 결과 상태 관리
const [users, setUsers] = useState(null);

//2.로딩 상태 관리
//loading 값은 현재 데이터를 로딩 중인지 아닌지 알려주는 값
const [loading, setLoading] = useState(false);

//3.Error 상태 관리
//에러가 발생하면 error에 값이 담길 것임!
const [error, setError] = useState(null);
```

<br><br>

그리고 컴포넌트가 처음 렌더링 될 때, **`axios`** 사용하여 api를 요청하도록 구현을 할 것임.

그리고 이 것은 **`useEffect`** 을 사용하여 구현.

```javascript
useEffect(() => {
  const fetchUsers = async () => {
    //먼저 try-catch 문을 사용하여 axios를 실행하고 에러가 발생되면 catch문 사용
    try {
      setUsers(null);
      setError(null); //user와 error 값을 초기화
      setLoading(true); //loading이 시작되었음을 설정하기 위해 loading 값을 true로 설정

      //REST api 요청
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/users/asdf"
      );
      //결과값 조회하기 위해서는 'response.data'값 조회하면 됨
      //결과값을 users에 등록
      setUsers(response.data);
    } catch (e) {
      //에러가 발생하면 발생한 e 값으로 Error 설정!
      setError(e);
      console.log(e.response.status);
    }
    //이 모든게 다 끝나면, 로딩이 끝났다고 다시 알려줘야 함!
    setLoading(false);
  };

  //위에서 만든 fetchUsers 함수 호출해 줌!
  fetchUsers();
}, []);
```

<br><br>

그 다음 위에서 설정한 세 상태에 따라 다른 화면을 렌더링 해줄 것임.

만약 문제가 있을 경우(정상적인 결과가 나오지 않았을 경우),  
아래처럼,

- 로딩중이건,
- 에러 처리 되었거나,
- user가 정상적으로 오지 않았을 경우,

다른 것들을 리턴하고,

```javascript
if (loading) return <div>로딩중...</div>;
if (error) return <div>에러가 발생했습니다...</div>;
if (!users) return null;
```

<br><br>

위 경우가 아닌 정상적인 결과를 받은 경우는 우리가 원했던 내용을 출력해준다.

```javascript
//여기서부턴 user가 정상적으로 아무 문제 없이 온 상황!
return (
  <ul>
    {users.map((user) => (
      <li key={user.id}>
        {user.username} ({user.name})
      </li>
    ))}
  </ul>
);
```

<br><br>

<details>
<summary> <b>+ 아래에 버튼을 두어 버튼을 누를 때 마다 api에서 불러오는 코드</b></summary>

```javascript
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
```

</details>

<br><br><br><br>
