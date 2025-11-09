import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import CategoryFilter from '../components/CategoryFilter';
import ImageGrid from '../components/ImageGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/Home.css';

function Home() {
  const [images, setImages] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [picturesRes, uppicturesRes, usersRes, categoriesRes, commentsRes, likesRes] =
          await Promise.all([
            fetch('http://localhost:5000/pictures'),
            fetch('http://localhost:5000/uppicture'),
            fetch('http://localhost:5000/users'),
            fetch('http://localhost:5000/categories'),
            fetch('http://localhost:5000/comments'),
            fetch('http://localhost:5000/likes'),
          ]);

        const picturesData = await picturesRes.json();
        const uppicturesData = await uppicturesRes.json();
        const usersData = await usersRes.json();
        const categoriesData = await categoriesRes.json();
        const commentsData = await commentsRes.json();
        const likesData = await likesRes.json();

        // Tạo map để đếm
        const commentCountMap = {};
        const likeCountMap = {};

        commentsData.forEach((comment) => {
          const imgId = String(comment.imageId);
          commentCountMap[imgId] = (commentCountMap[imgId] || 0) + 1;
        });

        likesData.forEach((like) => {
          const imgId = String(like.imageId);
          likeCountMap[imgId] = (likeCountMap[imgId] || 0) + 1;
        });

        // Cập nhật counts từ json-server
        const picturesTagged = picturesData.map((p) => ({
          ...p,
          _source: 'pictures',
          likes_count: likeCountMap[String(p.id)] || 0,
          comments_count: commentCountMap[String(p.id)] || 0,
        }));

        const uppicturesTagged = uppicturesData.map((p) => ({
          ...p,
          _source: 'uppicture',
          user_id: p.user_id ?? 2,
          likes_count: likeCountMap[String(p.id)] || 0,
          comments_count: commentCountMap[String(p.id)] || 0,
        }));

        const combined = [...picturesTagged, ...uppicturesTagged];
        setImages(combined);
        setUsers(usersData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredImages = images.filter((image) => {
    const matchesSearch =
      image.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      image.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === null ||
      image.category_id === Number(selectedCategory);

    console.log(
      `Image ${image.id}: category_id=${image.category_id}, selectedCategory=${selectedCategory}, matches=${matchesCategory}`
    );

    return matchesSearch && matchesCategory;
  });

  return (
    <div className='home'>
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <div className='home-content'>
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        {loading ? (
          <LoadingSpinner />
        ) : (
          <ImageGrid images={filteredImages} users={users} />
        )}
      </div>
    </div>
  );
}

export default Home;
