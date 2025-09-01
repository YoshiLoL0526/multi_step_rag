import { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';

const ConversationForm = ({ createConversation, onClose }) => {
    const [title, setTitle] = useState('');
    const [creating, setCreating] = useState(false);

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleCreate = async () => {
        if (!title.trim()) return;

        setCreating(true);
        await createConversation(title.trim());
        setCreating(false);

        onClose();
    };

    return (
        <div className="space-y-4">
            <Input
                label="Título de la conversación"
                value={title}
                onChange={handleTitleChange}
                placeholder="Ej: Preguntas sobre el capítulo 3"
                required
                autoFocus
            />
            <div className="flex justify-end space-x-3">
                <Button
                    variant="ghost"
                    onClick={onClose}
                    disabled={creating}
                >
                    Cancelar
                </Button>
                <Button
                    variant="primary"
                    onClick={handleCreate}
                    loading={creating}
                    disabled={!title.trim()}
                >
                    Crear
                </Button>
            </div>
        </div>
    );
};

export default ConversationForm;