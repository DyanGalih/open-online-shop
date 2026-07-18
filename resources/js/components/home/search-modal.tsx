import { Input, Modal } from 'antd';
import { Search } from 'lucide-react';

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
    return (
        <Modal
            open={isOpen}
            onCancel={onClose}
            footer={null}
            closeIcon={null}
            styles={{ body: { padding: '24px', borderRadius: '0px' } }}
            width={750}
            centered
        >
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 16,
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Search className="text-primary" size={24} />
                    <h2
                        style={{
                            margin: 0,
                            color: 'var(--foreground)',
                            fontSize: '1.4rem',
                            fontWeight: 600,
                            fontFamily: 'serif',
                        }}
                    >
                        Search Products
                    </h2>
                </div>
                <button
                    onClick={onClose}
                    style={{
                        background: 'none',
                        border: 'none',
                        fontSize: 24,
                        cursor: 'pointer',
                        color: 'var(--muted-foreground)',
                        fontWeight: 'bold',
                    }}
                >
                    &times;
                </button>
            </div>

            <Input
                prefix={
                    <Search
                        size={20}
                        className="text-muted-foreground"
                        style={{ marginRight: 8 }}
                    />
                }
                placeholder="What are you looking for?"
                style={{
                    borderRadius: 'var(--radius)',
                    padding: '14px 24px',
                    fontSize: '1.05rem',
                    marginBottom: 16,
                    border: '1px solid var(--border)',
                }}
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span
                    style={{
                        fontSize: '0.9rem',
                        color: 'var(--muted-foreground)',
                        fontWeight: 600,
                    }}
                >
                    Suggested keywords:
                </span>
                <span
                    style={{
                        padding: '4px 14px',
                        borderRadius: 0,
                        border: '1px solid var(--border)',
                        color: 'var(--foreground)',
                        background: 'var(--background)',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                    }}
                >
                    Ceramic
                </span>
                <span
                    style={{
                        padding: '4px 14px',
                        borderRadius: 0,
                        border: '1px solid var(--border)',
                        color: 'var(--foreground)',
                        background: 'var(--background)',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                    }}
                >
                    Scented
                </span>
                <span
                    style={{
                        padding: '4px 14px',
                        borderRadius: 0,
                        border: '1px solid var(--border)',
                        color: 'var(--foreground)',
                        background: 'var(--background)',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                    }}
                >
                    Minimal
                </span>
            </div>
        </Modal>
    );
}
