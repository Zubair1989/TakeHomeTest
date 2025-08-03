import React from "react";
import styles from "./update-modal.module.css";

type ModalProps = {
  children: React.ReactNode;
  onClose: () => void;
};

export const UpdateModal = ({ children, onClose }: ModalProps) => {
  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <div className={styles.modal}>
        <button onClick={onClose} style={{ float: "right" }}>X</button>
        {children}
      </div>
    </>
  );
};