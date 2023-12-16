import React, { useEffect, useState } from "react";
import "./Home.css";
import Header from "../../components/header/Header.jsx";
import Posts from "../../components/posts/Posts.jsx";
import Sidebar from "../../components/sidebar/Sidebar.jsx";
import axios from "axios";
import { useLocation } from "react-router";

function Home() {
  let [posts, setPosts] = useState([]);
  let { search } = useLocation();

  useEffect(() => {
    let fetchPosts = async () => {
      let res = await axios.get("/posts" + search);
      setPosts(res.data);
    };
    fetchPosts();
  }, [search]);
  return (
    <div>
      <Header></Header>
      <div className="home">
        <Posts posts={posts} />
        <Sidebar></Sidebar>
      </div>
    </div>
  );
}

export default Home;
