import React from "react";

// Rendering individual images
const Image = ({ image }) => {
  return (
    <div className="file-item d-flex justify-content-center">
      <img alt={`img - ${image.id}`} src={image.src} className="file-img"width={200} height={200} />
    </div>
  );
};

// ImageList Component
const ImageList = ({ images }) => {

  // render each image by calling Image component
  const renderImage = (image, index) => {
    return (
      <Image
        image={image}
        key={`${image.id}-image`}
      />
    );
  };

  // Return the list of files
  return <section className="file-list">{images.map(renderImage)}</section>;
};

export default Image;
