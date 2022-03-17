import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getDatabase, ref, child, get, update } from "firebase/database";
import { app } from "../Firebase/Firebase";
import Navbar from "react-bootstrap/Navbar";
import { Row,Col,Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Nav,
  Offcanvas,
  Form,
  Button,
} from "react-bootstrap";
import Pagination from "./Pagination";
import "./Home.css";

function Home() {
  const location = useLocation();
  const dbRef = ref(getDatabase(app));
  const navigate=useNavigate();
  const [user, setUser] = useState({});
  const [userList, setUserList] = useState([]);
  const [nameState,setNameState]=useState(true);
  const [nameIcon,setNameIcon]=useState("bi bi-pencil-square");
  const [statusState,setStatusState]=useState(true);
  const [statusIcon,setStatusIcon]=useState("bi bi-pencil-square");
  const [textName,setTextName]=useState("");
  const [textStatus,setTextStatus]=useState("");
  const [totalLikes,setTotalLikes]=useState({});
  const [totalDislikes,setTotalDislikes]=useState({});
  const [liked,setLiked]=useState({});
  const [disliked,setDisliked]=useState({});
  const [currentPage,setCurrentPage]=useState(1);
  const [postsPerPage]=useState(4);

  const indOfFirstPost=(currentPage-1)*postsPerPage;
  //change page
  const paginate=(pageNumber)=>{
    setCurrentPage(pageNumber);
  }

  useEffect(() => {
    async function fetchData(){
      console.log(location.state);
      console.log("1");
      await get(child(dbRef, "users/" + location.state.replaceAll(".", ",")))
        .then((snapshot) => {
          if (snapshot.exists()) {
            console.log(snapshot.val());
            setUser(snapshot.val());
            if("status" in snapshot.val()){
              setTextStatus(snapshot.val().status);
            }
            if("likes" in snapshot.val()){
              setTotalLikes(snapshot.val().likes);
            }
            if("dislikes" in snapshot.val()){
              setTotalDislikes(snapshot.val().dislikes);
            }
            setTextName(snapshot.val().name);
          } else {
            console.log("No data available");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
    fetchData();
  }, [dbRef, location]);

  useEffect(() => {
    async function fetchUserList(){
      await get(child(dbRef, "users/"))
      .then((snapshot) => {
        if (snapshot.exists()) {
          console.log(snapshot.val());
          let tempUsers=snapshot.val();
          // tempUsers.remove(location.state.replaceAll(".", ","));
          console.log("2");
          delete tempUsers[location.state.replaceAll(".", ",")];
          let tempLikes={};
          let tempDislikes={};
          Object.keys(snapshot.val()).map((key)=>{
            liked[key]=false;
            disliked[key]=false;
            if("likes" in snapshot.val()[key]){
              // setTotalLikes({...totalLikes,[key]:snapshot.val()[key]["likes"]});
              tempLikes[key]=snapshot.val()[key]["likes"];
            }
            else{
              // setTotalLikes({...totalLikes,[key]:0});
              tempLikes[key]=0;
            }
            if("dislikes" in snapshot.val()[key]){
              // setTotalDislikes({...totalDislikes,[key]:snapshot.val()[key]["dislikes"]});
              tempDislikes[key]=snapshot.val()[key]["dislikes"];
            }
            else{
              // setTotalDislikes({...totalDislikes,[key]:0});
              tempDislikes[key]=0;
            }
          });

          // let x=Array(Object.keys(tempUsers));
          // console.log(x[0]);
          // console.log(tempLikes);
          // x[0].sort(function(a, b){  
          //   return tempLikes[a] - tempLikes[b];
          // });
          setUserList(tempUsers);
          setTotalLikes(tempLikes);
          setTotalDislikes(tempDislikes);
        }
        else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
    }
    fetchUserList();
  }, [dbRef]);

  const toggleShow = () => setShow((s) => !s);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  const updateName=(event)=>{
    setTextName(event.target.value);
  }
  const updateStatus=(event)=>{
    setTextStatus(event.target.value);
  }

  const handleNameButton=(e)=>{
    if(nameState){
      setNameState(false);      
      setNameIcon("bi bi-check2-all");
    }
    else{
      setNameState(true);
      setUser({...user,name:textName})
      const updates = {};
      updates["users/" + location.state.replaceAll(".", ",") + "/name/"] = textName;
      update(dbRef, updates);
      setNameIcon("bi bi-pencil-square");
    }
  }

  const handleStatusButton=(e)=>{
    if(statusState){
      setStatusState(false);      
      setStatusIcon("bi bi-check2-all");
    }
    else{
      setStatusState(true);
      const updates = {};
      updates["users/" + location.state.replaceAll(".", ",") + "/status/"] = textStatus;
      update(dbRef, updates);
      setStatusIcon("bi bi-pencil-square");
    }
  }

  const handleChangeImage = (e) => {
    // this.setState({[e.target.name]: URL.createObjectURL(e.target.files[0])})
    const updates = {};
    let url = URL.createObjectURL(e.target.files[0]);
    updates["users/" + location.state.replaceAll(".", ",") + "/photo/"] = url;
    update(dbRef, updates);
    setUser({ ...user, photo: url });
  };
  const handleLike=(e)=>{
    const key=e.target.getAttribute('name');
    const updates = {};
    if(liked[key]==true){
      setLiked({...liked,[key]:false});//update just one entry,updating whole array will not update dom
      setTotalLikes({...totalLikes,[key]:totalLikes[key]-1});
      updates["users/" + key + "/likes/"] = totalLikes[key]-1;
    }
    else{
      setLiked({...liked,[key]:true});
      console.log(totalLikes);
      console.log(totalLikes[key]);
      setTotalLikes({...totalLikes,[key]:totalLikes[key]+1});
      updates["users/" + key + "/likes/"] = totalLikes[key]+1;
      if(disliked[key]==true){
        setDisliked({...disliked,[key]:false});
        setTotalDislikes({...totalDislikes,[key]:totalDislikes[key]-1});
        updates["users/" + key + "/dislikes/"] = totalDislikes[key]-1;
      }
    }
    update(dbRef, updates);
  }
  const handleDislike=(e)=>{
    const key=e.target.getAttribute('name');
    const updates = {};
    if(disliked[key]==true){
      setDisliked({...disliked,[key]:false});//update just one entry,updating whole array will not update dom
      setTotalDislikes({...totalDislikes,[key]:(totalDislikes[key]-1)});
      updates["users/" + key + "/dislikes/"] = totalDislikes[key]-1;
    }
    else{
      setDisliked({...disliked,[key]:true});
      setTotalDislikes({...totalDislikes,[key]:totalDislikes[key]+1});
      updates["users/" + key + "/dislikes/"] = totalDislikes[key]+1;
      if(liked[key]==true){
        setLiked({...liked,[key]:false});
        setTotalLikes({...totalLikes,[key]:totalLikes[key]-1});
        updates["users/" + key + "/likes/"] = totalLikes[key]-1;
      }
    }
    update(dbRef, updates);
  }
  const handleLogout=()=>{
    navigate("/");
  }
  return (
    <div>
      <Navbar bg="dark" variant="dark" className="Navbar">
        <Container fluid>
          <Navbar.Brand>
            <img id="brand_img"
              src={user.photo}
              className="img-fluid rounded-circle"
            ></img>
          </Navbar.Brand>
          
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <h3 className="h3_nav">Checkout Others</h3>
        </Container>
        <Nav className="rightNav">
          <Button
            onClick={toggleShow}
            variant="primary"
            size="lg"
            className="button"
          >
            <i className="bi bi-person-fill"></i> {user.name}{" "}
            <i className="bi bi-chevron-down"></i>
          </Button>
          <Offcanvas
            show={show}
            onHide={handleClose}
            scroll={true}
            backdrop={false}
            placement="end"
            className="offcanvas"
          >
            <Offcanvas.Body>
              <div className="offcanvas-body">
                <div role="button">
                  <center>
                    <div className="image-upload">
                      <label htmlFor="file-input">
                        <img
                          id="img"
                          src={user.photo}
                          className="img-fluid rounded-circle"
                          alt=""
                        ></img>
                      </label>
                      <input
                        type="file"
                        id="file-input"
                        name="img"
                        accept="image/*"
                        className="w-100"
                        onChange={handleChangeImage}
                      />
                    </div>

                    <div className="div_name">
                      <h6 color="white" className="h6_name" align="left">Your Name</h6>
                      <Row>
                      <Col sm="10">
                      <Form.Control
                        type="text"
                        className="text_name"
                        value={textName}
                        onChange={updateName}
                        placeholder={"Enter Name"}
                        aria-label="Name"
                        readOnly={nameState}
                      />
                      </Col>
                      <Col sm="1" align="bottom">
                      <Button onClick={handleNameButton} className="button_name"><i className={nameIcon}></i></Button>
                      </Col>
                      </Row>
                    </div>

                    <div className="div_status">
                      <h6 color="white" className="h6_name" align="left">Your Status</h6>
                      <Row>
                      <Col sm="10">
                      <Form.Control
                        type="text"
                        className="text_name"
                        value={textStatus}
                        onChange={updateStatus}
                        aria-label="Status"
                        readOnly={statusState}
                      />
                      </Col>
                      <Col sm="1" align="bottom">
                      <Button onClick={handleStatusButton} className="button_name"><i className={statusIcon}></i></Button>
                      </Col>
                      </Row>
                    </div>
                    <div>
                      <Button variant="primary" onClick={handleLogout} className="logout_button">Logout</Button>
                    </div>
                  </center>
                </div>
              </div>
            </Offcanvas.Body>
          </Offcanvas>
        </Nav>
      </Navbar>
    
    <div className="body">
    <div className="row">
    {Object.entries(userList).sort(([a],[b])=>totalLikes[b]-totalLikes[a]).slice(indOfFirstPost,indOfFirstPost+postsPerPage).map(([key,val])=>{
      if(userList[key].email!=user.email)
      return(
        
        <div key={key} id="cardItem" className="col-sm-3">
          <div className='card' style={{width:'18rem'}}>
          <div className="card-body">
            <h3 className="card-title">{userList[key].name}</h3>
            <img id="card_img"
              src={userList[key].photo}
              className="img-fluid rounded-circle"
            ></img>
            {("status" in userList[key] && userList[key].status.length>0) ? <h6 className='card-status'>{userList[key].status}</h6> : <h6 className='card-status'>Status not set</h6>}
            <Card.Footer>
            <Row>
            <Col>
            {liked[key] ? <i className="bi bi-hand-thumbs-up-fill" name={key} onClick={handleLike}></i> : <i className="bi bi-hand-thumbs-up" name={key} onClick={handleLike}></i>}
            
            
            <p>{totalLikes[key]}</p>
            </Col><Col>
            {disliked[key] ? <i className="bi bi-hand-thumbs-down-fill" name={key} onClick={handleDislike}></i> : <i className="bi bi-hand-thumbs-down" name={key} onClick={handleDislike}></i>}
            
            <p>{totalDislikes[key]}</p>
            </Col>
            </Row>
            </Card.Footer>
        </div>
        </div>
        </div>
      )})}
    </div>
  </div>
  <div className="pagination">
  <Pagination postsPerPage={postsPerPage} totalPosts={Object.entries(userList).length} paginate={paginate} />
  </div>
  </div>
  );
}

export default Home;
