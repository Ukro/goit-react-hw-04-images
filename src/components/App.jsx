import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Searchbar from "./Searchbar/Searchbar";
import ImageGallery from "./ImageGallery/ImageGallery";
import fetchImagesWithQuery from "../services/api";
import Modal from "./Modal/Modal";
import Loader from "./Loader/Loader";
import Button from "./Button/Button";
import s from "./App.module.css";

export default function App() {
  const [searchData, setSearchData] = useState("");
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [largeImage, setLargeImage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetchImagesWithQuery(searchData, page);
        const data = response.data;
        if (data.hits.length === 0) {
          toast.error("Nothing found");
        } else {
          setImages((prevImages) => {
            const newImages = data.hits.filter(({ id }) => !prevImages.some((image) => image.id === id));
            return [...prevImages, ...newImages];
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (searchData !== "") {
      fetchData();
    }
  }, [searchData, page]);

  const onSubmit = (newSearchData) => {
    if (newSearchData.trim() === "") {
      return toast.error("Enter a search term");
    }
    setSearchData(newSearchData);
    setPage(1);
    setImages([]);
  };

  const nextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const openModal = (index) => {
    setShowModal(true);
    setLargeImage(images[index].largeImageURL);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  return (
    <div className={s.App}>
      <Searchbar onSubmit={onSubmit} />
      {images.length !== 0 && (
        <ImageGallery images={images} openModal={openModal} />
      )}
      {showModal && <Modal toggleModal={toggleModal} largeImage={largeImage} />}
      {isLoading && <Loader />}
      <ToastContainer autoClose={2500} />
      {images.length >= 12 && <Button nextPage={nextPage} />}
    </div>
  );
}