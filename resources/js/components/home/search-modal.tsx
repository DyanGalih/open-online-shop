import React from 'react';
import { Modal, Input } from 'antd';
import { Wand2, Search } from 'lucide-react';

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
            styles={{ body: { padding: '24px', borderRadius: '24px' } }}
            width={750}
            centered
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Wand2 color="#C86363" size={24} />
                    <h2 style={{ margin: 0, color: '#3C3542', fontSize: '1.4rem', fontWeight: 800 }}>Find your fuzzy friend</h2>
                </div>
                <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: '#9CA3AF', fontWeight: 'bold' }}>&times;</button>
            </div>
            
            <Input 
                prefix={<Search size={20} color="#9CA3AF" style={{ marginRight: 8 }} />}
                placeholder="Search by character, color, or tags..."
                style={{ borderRadius: 24, padding: '14px 24px', fontSize: '1.05rem', marginBottom: 16, border: '1px solid #D1D5DB' }}
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: '0.9rem', color: '#4B5563', fontWeight: 600 }}>Trending tags:</span>
                <span style={{ padding: '4px 14px', borderRadius: 20, border: '1px solid #FCA5A5', color: '#C86363', background: '#FEF2F2', fontSize: '0.8rem' }}>#bunny</span>
                <span style={{ padding: '4px 14px', borderRadius: 20, border: '1px solid #93C5FD', color: '#3B82F6', background: '#EFF6FF', fontSize: '0.8rem' }}>#stellar</span>
                <span style={{ padding: '4px 14px', borderRadius: 20, border: '1px solid #FCD34D', color: '#D97706', background: '#FFFBEB', fontSize: '0.8rem' }}>#kitten</span>
            </div>
        </Modal>
    );
}
