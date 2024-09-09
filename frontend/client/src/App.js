import React, { useState, useEffect } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Container,
    Grid,
    Card,
    CardContent,
    TextField,
    Button,
    Modal,
    makeStyles,
    IconButton
} from '@material-ui/core';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    AccountCircle as AccountCircleIcon
} from '@material-ui/icons'; 
import axios from 'axios';
import './App.css';

const apiUrl = 'http://localhost:3000';

const useStyles = makeStyles((theme) => ({
    modal: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    },
}));

function App() {
    const classes = useStyles();
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState({
        title: '',
        content: ''
    });
    const [editingPost, setEditingPost] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        axios.get(`${apiUrl}/posts`)
            .then(response => {
                setPosts(response.data);
            })
            .catch(error => {
                console.error('Error fetching posts:', error);
            });
    }, []);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewPost(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleAddPost = () => {
      if (newPost.title.trim() !== '' && newPost.content.trim() !== '') {
          axios.post(`${apiUrl}/posts`, newPost)
              .then(response => {
                  setPosts(prevState => [...prevState, response.data]);
                  setNewPost({ title: '', content: '' });
              })
              .catch(error => {
                  console.error('Error adding post:', error);
              });
      } else {
          console.error('Title and content cannot be empty.');
      }
  };

    const handleDeletePost = (id) => {
        axios.delete(`${apiUrl}/posts/${id}`)
            .then(() => {
                setPosts(prevState => prevState.filter(post => post._id !== id));
            })
            .catch(error => {
                console.error('Error deleting post:', error);
            });
    };

    const handleEditPost = (post) => {
        setEditingPost(post);
        setOpenModal(true);
    };
    

    const handleUpdatePost = () => {
        axios.put(`${apiUrl}/posts/${editingPost._id}`, editingPost)
            .then(response => {
                setPosts(prevState => prevState.map(post => {
                    if (post._id === response.data._id) {
                        return response.data;
                    }
                    return post;
                }));
                setOpenModal(false);
                setEditingPost(null);
            })
            .catch(error => {
                console.error('Error updating post:', error);
            });
    };

    return (
        <div className="app">
            <AppBar position="static" className="app-bar">
                <Toolbar>
                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                        My Blog
                    </Typography>
                    <IconButton color="inherit">
                        <AccountCircleIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Container maxWidth="lg" className="container">
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={4}>
                        <Card className="card">
                            <CardContent className="card-content">
                                <TextField
                                    label="Title"
                                    name="title"
                                    value={newPost.title}
                                    onChange={handleInputChange}
                                    fullWidth
                                    margin="normal"
                                />
                                <TextField
                                    label="Content"
                                    name="content"
                                    value={newPost.content}
                                    onChange={handleInputChange}
                                    multiline
                                    fullWidth
                                    margin="normal"
                                />
                            </CardContent>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<AddIcon />}
                                className="add-post-button"
                                onClick={handleAddPost}
                            >
                                Add Post
                            </Button>
                        </Card>
                    </Grid>
                    {posts.map(post => (
                        <Grid key={post._id} item xs={12} sm={6} md={4}>
                            <Card className="card">
                                <CardContent className="card-content">
                                    <Typography variant="h5" className="post-title">
                                        {post.title}
                                    </Typography>
                                    <Typography variant="body2" className="post-content">
                                        {post.content}
                                    </Typography>
                                </CardContent>
                                <div className="card-actions">
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        startIcon={<EditIcon />}
                                        onClick={() => handleEditPost(post)} // Handle edit
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        startIcon={<DeleteIcon />}
                                        onClick={() => handleDeletePost(post._id)} // Handle delete
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
            <Modal open={openModal} onClose={() => setOpenModal(false)}>
                <div className={classes.modal}>
                    <h2>Edit Post</h2>
                    <TextField
                        label="Title"
                        name="title"
                        value={editingPost ? editingPost.title : ''}
                        onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Content"
                        name="content"
                        value={editingPost ? editingPost.content : ''}
                        onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                        multiline
                        fullWidth
                        margin="normal"
                    />
                    <Button variant="contained" color="primary" onClick={handleUpdatePost}>
                        Update
                    </Button>
                </div>
            </Modal>
        </div>
    );
}

export default App;
