
import { useState } from "react";
import axios from "axios";

export default function Signup() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] =
    useState(false);

  const handleChange = (e) => {

    setForm({
      ...form,
      [e.target.name]:
      e.target.value,
    });

  };

  const handleSubmit =
  async () => {

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.password.trim()
    ) {

      alert(
        "Please fill all fields"
      );

      return;
    }

    try {

      setLoading(true);

      const response =
      await axios.post(
        "http://localhost:8082/auth/signup",
        form
      );

      alert(
        response.data ||
        "✅ User created successfully"
      );

      setForm({
        name: "",
        email: "",
        password: "",
      });

    } catch (error) {

      console.log(error);

      alert(
        error?.response?.data ||
        "❌ Signup failed"
      );

    } finally {

      setLoading(false);

    }

  };

  const styles = {

page:{
minHeight:"100vh",
display:"flex",
justifyContent:"center",
alignItems:"center",
padding:"20px",
background:
"linear-gradient(135deg,#F87714,#FFA04A)",
fontFamily:"Inter"
},

card:{
width:"430px",
background:"#fff",
padding:"40px",
borderRadius:"24px",
boxShadow:
"0 20px 50px rgba(0,0,0,.15)"
},

title:{
fontSize:"32px",
fontWeight:"700",
marginBottom:"10px"
},

subtitle:{
color:"#777",
marginBottom:"25px"
},

input:{
width:"100%",
height:"56px",
padding:"0 18px",
marginBottom:"18px",
border:"1px solid #ddd",
borderRadius:"12px",
fontSize:"15px"
},

button:{
width:"100%",
height:"56px",
background:"#F87714",
color:"#fff",
border:"none",
borderRadius:"12px",
fontSize:"18px",
cursor:"pointer"
},

bottom:{
marginTop:"20px",
textAlign:"center"
}

};

return(

<div style={styles.page}>

<div style={styles.card}>

<h1 style={styles.title}>
Create Account
</h1>

<p style={styles.subtitle}>
Create your profile
</p>

<input
style={styles.input}
name="name"
value={form.name}
placeholder="Full Name"
onChange={handleChange}
/>

<input
style={styles.input}
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
onClick={handleSubmit}
disabled={loading}
>

{
loading
?
"Creating..."
:
"Create Account"
}

</button>

<p style={styles.bottom}>
Already have account?
<b> Login</b>
</p>

</div>

</div>

);

}

