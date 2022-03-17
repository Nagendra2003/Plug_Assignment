import React from "react";
import { useNavigate } from "react-router-dom";
import { app, auth } from "../Firebase/Firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getDatabase, ref, update,get,child } from "firebase/database";
import { Button,ListGroup } from "react-bootstrap";
import './Home.css'

export default function Login() {
  let navigate = useNavigate();
  const updateDatabase = async(user) => {
    const dbRef = ref(getDatabase(app));
    const updates = {};
    console.log("3");
    updates["users/" + user.email.replaceAll(".", ",") + "/name/"] = user.name;
    updates["users/" + user.email.replaceAll(".", ",") + "/email/"] =user.email;
    updates["users/" + user.email.replaceAll(".", ",") + "/photo/"] =user.photo;
    await update(dbRef, updates);
  };
  const LoginWithFirebase = async (e) => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider)
      .then((re) => {
        updateDatabase({
          name: re["user"]["displayName"],
          photo: re["user"]["photoURL"],
          email: re["user"]["email"],
        });
        navigate("/home", { state: re["user"]["email"] });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const LoginAnonymous = async (e) => {
    await fetch("https://randomuser.me/api/")
      .then((results) => {
        results
          .json()
          .then((data) => {
            console.log(data);
            let s =
              data["results"][0]["name"]["first"] +
              " " +
              data["results"][0]["name"]["last"];
            updateDatabase({
              name: s,
              photo: data["results"][0]["picture"]["medium"],
              email: data["results"][0]["email"],
            });

            updatePrevAnonymous({
              name: s,
              photo: data["results"][0]["picture"]["medium"],
              email: data["results"][0]["email"],
            })
            navigate("/home", { state: data["results"][0]["email"] });
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const updatePrevAnonymous=async(user)=>{
    const dbRef = ref(getDatabase(app));
    const updates = {};
    updates["prevanonymous/name/"] = user.name;
    updates["prevanonymous/email/"] =user.email;
    updates["prevanonymous/photo/"] =user.photo;
    await update(dbRef, updates);
  }
  const LoginwithPrevAnonymous=async()=>{
    const dbRef = ref(getDatabase(app));
    get(child(dbRef, "prevanonymous/email/"))
    .then((snapshot)=>{
      if(snapshot.val()!=null){
        navigate("/home",{state: snapshot.val()});
      }
      else{
        alert("No Anonymous Account Available")
      }
    })
    .catch((error) => {
      console.error(error);
    });
    
  }
  return (
    <div className="login_buttons">
      <ListGroup as="ol" numbered>
        <ListGroup.Item><Button onClick={LoginWithFirebase}>Google Login</Button></ListGroup.Item>
        <ListGroup.Item><Button onClick={LoginAnonymous}>Anonymous Login</Button></ListGroup.Item>
        <ListGroup.Item><Button onClick={LoginwithPrevAnonymous}>Login back with Previous Anonymous Account</Button></ListGroup.Item>
      </ListGroup>
    </div>
  );
}
