import { useState } from 'react'
import { Trash2 } from 'lucide-react';
import Button from '../ui/Button'


const DocumentDelete = ({ onClose, onDelete }) => {
    const [deleting, setDeleting] = useState(false)

    const handleDelete = async () => {
        setDeleting(true)
        await onDelete()
        setDeleting(false)
    }

    return (
        <div className="space-y-4">
            <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-10 h-10 bg-error-100 rounded-full flex items-center justify-center">
                    <Trash2 className="h-5 w-5 text-error-600" />
                </div>
                <div className="flex-1">
                    <h3 className="text-sm font-medium text-neutral-900 mb-1">
                        ¿Eliminar documento?
                    </h3>
                    <p className="text-sm text-neutral-600">
                        Eliminarás permanentemente "{document?.title || document?.filename}".
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
                    onClick={handleDelete}
                    loading={deleting}
                >
                    Eliminar documento
                </Button>
            </div>
        </div >
    )
}

export default DocumentDelete;