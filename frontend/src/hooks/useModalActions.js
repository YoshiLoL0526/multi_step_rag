import { useModal } from '../contexts/ModalContext';
import { useCallback } from 'react';

export const useModalActions = () => {
    const { openModal, closeModal, closeAllModals } = useModal();

    const showModal = useCallback((config) => {
        return openModal({
            size: 'md',
            showCloseButton: true,
            closeOnOverlayClick: true,
            closeOnEscape: true,
            ...config
        });
    }, [openModal]);

    const showConfirmDialog = useCallback((config) => {
        return openModal({
            size: 'sm',
            showCloseButton: true,
            closeOnOverlayClick: false,
            closeOnEscape: false,
            ...config
        });
    }, [openModal]);

    const showUploadModal = useCallback((config) => {
        return openModal({
            size: 'lg',
            title: 'Subir documento',
            showCloseButton: true,
            closeOnOverlayClick: false,
            closeOnEscape: true,
            ...config
        });
    }, [openModal]);

    return {
        showModal,
        showConfirmDialog,
        showUploadModal,
        closeModal,
        closeAllModals
    };
};