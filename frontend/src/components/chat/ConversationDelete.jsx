import { useState } from 'react'
import { Trash2 } from 'lucide-react';
import Button from '../ui/Button'


const ConversationDelete = ({ onClose, onConfirm }) => {
    const [deleting, setDeleting] = useState(false)

    const handleConfirmClick = async () => {
        setDeleting(true)
        await onConfirm()
        setDeleting(false)
        onClose()
    }

    return (
        <div className="space-y-4">
            <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-error-100 rounded-full flex items-center justify-center">
                    <Trash2 className="h-5 w-5 text-error-600" />
                </div>
                <div className="flex-1">
                    <h3 className="text-sm font-medium text-neutral-900 mb-1">
                        ¿Eliminar conversación?
                    </h3>
                    <p className="text-sm text-neutral-600">
                        Eliminarás permanentemente la conversación.
                        Esta acción no se puede deshacer.
                    </p>
                </div>
            </div>

            <div className="flex justify-end space-x-3">
                <Button
                    variant="ghost"
                    onClick={onClose}
                    disabled={deleting}
                >
                    Cancelar
                </Button>
                <Button
                    variant="danger"
                    onClick={handleConfirmClick}
                    loading={deleting}
                >
                    Eliminar
                </Button>
            </div>
        </div>
    );
}

export default ConversationDelete;