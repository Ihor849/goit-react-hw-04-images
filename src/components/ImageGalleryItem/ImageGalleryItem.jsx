import PropTypes from 'prop-types';
import { Item, Image } from './ImageGalleryItem.styled';

import { useState } from 'react';
import Modal from 'components/Modal/Modal';

export default function ImageGalleryItem({ item }) {
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const { webformatURL, tags } = item;

  return (
    <Item className="gallery-item">
      <Image src={webformatURL} alt={tags} onClick={toggleModal} />
      {showModal && <Modal onClose={toggleModal} image={item} />}
    </Item>
  );
}

ImageGalleryItem.propTypes = {
  item: PropTypes.object,
};
