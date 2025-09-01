import { useModal } from '../../contexts/ModalContext';
import GlobalModal from './GlobalModal';

const ModalContainer = () => {
    const { modals, closeModal } = useModal();

    if (modals.length === 0) return null;

    return (
        <>
            {modals.map((modal) => (
                <GlobalModal
                    key={modal.id}
                    id={modal.id}
                    isOpen={modal.isOpen}
                    onClose={() => closeModal(modal.id)}
                    title={modal.title}
                    size={modal.size}
                    showCloseButton={modal.showCloseButton}
                    closeOnOverlayClick={modal.closeOnOverlayClick}
                    closeOnEscape={modal.closeOnEscape}
                >
                    {modal.content}
                </GlobalModal>
            ))}
        </>
    );
};

export default ModalContainer;