import { useState } from "react";
import axios from "axios";

export default function Login() {

const [form,setForm]=useState({
email:"",
password:"",
});

const [loading,setLoading]=
useState(false);

const handleChange=(e)=>{

setForm({
...form,
[e.target.name]:
e.target.value,
});

};

const login=
async()=>{

if(
!form.email.trim()||
!form.password.trim()
){

alert(
"Please fill all fields"
);

return;

}

try{

setLoading(true);

const response=
await axios.post(
"http://localhost:8082/auth/login",
form
);

alert(
response.data
||
"✅ Login Success"
);

setForm({
email:"",
password:"",
});

}
catch(error){

console.log(error);

alert(
error?.response?.data
||
"❌ Invalid Credentials"
);

}
finally{

setLoading(false);

}

};

const styles={

page:{
minHeight:"100vh",
display:"flex",
justifyContent:"center",
alignItems:"center",
background:
"linear-gradient(135deg,#F87714,#FFA04A)",
fontFamily:"Inter"
},

card:{
width:"420px",
background:"#fff",
padding:"40px",
borderRadius:"24px",
boxShadow:
"0 20px 60px rgba(0,0,0,.2)"
},

title:{
fontSize:"32px",
fontWeight:"700",
marginBottom:"10px"
},

subtitle:{
color:"#64748B",
marginBottom:"30px"
},

input:{
width:"100%",
height:"56px",
marginBottom:"18px",
padding:"0 18px",
borderRadius:"12px",
border:"1px solid #ddd"
},

button:{
width:"100%",
height:"56px",
border:"none",
borderRadius:"12px",
background:"#F87714",
color:"#fff",
fontWeight:"700",
cursor:"pointer",
fontSize:"18px"
},

bottom:{
marginTop:"20px",
textAlign:"center"
},

link:{
color:"#F87714",
fontWeight:"700"
}

};

return(

<div style={styles.page}>

<div style={styles.card}>

<h1 style={styles.title}>
Welcome Back
</h1>

<p style={styles.subtitle}>
Login to continue
</p>

<input
style={styles.input}
type="email"
name="email"
value={form.email}
placeholder="Email"
onChange={handleChange}
/>

<input
style={styles.input}
type="password"
name="password"
value={form.password}
placeholder="Password"
onChange={handleChange}
/>

<button
style={styles.button}
onClick={login}
disabled={loading}
>

{
loading
?
"Logging in..."
:
"Login"
}

</button>

<p style={styles.bottom}>
New user?
<span style={styles.link}>
 Sign Up
</span>
</p>

</div>

</div>

);

}
