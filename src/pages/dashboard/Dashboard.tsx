import React, { useState, useEffect } from 'react';
import { LinkIcon, MousePointerClick, Activity, AlertCircle, Copy, Edit2, Trash2, X } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import { useAuth } from '../../contexts/AuthContext';
import { ShortLink, getUserLinks, createAuthLink, updateLink, deleteLink } from '../../services/linkService';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const [links, setLinks] = useState<ShortLink[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  
  // Form states
  const [originalUrl, setOriginalUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [editingLink, setEditingLink] = useState<ShortLink | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchLinks = async () => {
    if (!currentUser) return;
    try {
      const data = await getUserLinks(currentUser.uid);
      setLinks(data);
    } catch (error) {
      console.error("Failed to fetch links", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, [currentUser]);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setIsSubmitting(true);
    try {
      await createAuthLink(originalUrl, customAlias, currentUser.uid);
      setIsCreateOpen(false);
      setOriginalUrl('');
      setCustomAlias('');
      await fetchLinks();
    } catch (error: any) {
      alert(error.message || "Failed to create link");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLink) return;
    setIsSubmitting(true);
    try {
      await updateLink(editingLink.alias, { originalUrl, isActive: editingLink.isActive });
      setIsEditOpen(false);
      setEditingLink(null);
      await fetchLinks();
    } catch (error: any) {
      alert("Failed to update link");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (alias: string) => {
    if (confirm('Are you sure you want to delete this link?')) {
      try {
        await deleteLink(alias);
        setLinks(links.filter(l => l.alias !== alias));
      } catch (error) {
        alert("Failed to delete link");
      }
    }
  };

  const totalLinks = links.length;
  const totalClicks = links.reduce((acc, curr) => acc + curr.clickCount, 0);
  const activeLinks = links.filter(l => l.isActive).length;

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Dashboard</h1>
          <Button onClick={() => {
            setOriginalUrl('');
            setCustomAlias('');
            setIsSubmitting(false);
            setIsCreateOpen(true);
          }}>Create New Link</Button>
        </div>

        <div className="summary-cards">
          <Card className="summary-card">
            <div className="summary-icon"><LinkIcon size={24} /></div>
            <div className="summary-info">
              <h3>Total Links</h3>
              <p className="summary-value">{totalLinks}</p>
            </div>
          </Card>
          <Card className="summary-card">
            <div className="summary-icon"><MousePointerClick size={24} /></div>
            <div className="summary-info">
              <h3>Total Clicks</h3>
              <p className="summary-value">{totalClicks}</p>
            </div>
          </Card>
          <Card className="summary-card">
            <div className="summary-icon"><Activity size={24} /></div>
            <div className="summary-info">
              <h3>Active Links</h3>
              <p className="summary-value">{activeLinks}</p>
            </div>
          </Card>
        </div>

        <div className="recent-links-section">
          <h2 className="section-title">Your Links</h2>
          
          <div className="links-list">
            {loading ? (
              <p>Loading links...</p>
            ) : links.map(link => (
              <Card key={link.id} className="link-item-card">
                <div className="link-details">
                  <div className="link-title-row">
                    <a href={`https://shorturlplx.vercel.app/${link.alias}`} className="link-alias" target="_blank" rel="noreferrer">
                      shorturlplx.vercel.app/{link.alias}
                    </a>
                    <span className={`status-badge ${link.isActive ? 'status-active' : 'status-disabled'}`}>
                      {link.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                  <p className="link-original">{link.originalUrl}</p>
                  
                  <div className="link-meta">
                    <span className="meta-item"><MousePointerClick size={14} /> {link.clickCount} clicks</span>
                    <span className="meta-item">Created: {new Date(link.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="link-actions">
                  <Button variant="ghost" size="sm" aria-label="Copy" onClick={() => {
                    navigator.clipboard.writeText(`https://shorturlplx.vercel.app/${link.alias}`);
                    alert('Link copied!');
                  }}>
                    <Copy size={16} />
                  </Button>
                  <Button variant="ghost" size="sm" aria-label="Edit" onClick={() => {
                    setEditingLink(link);
                    setOriginalUrl(link.originalUrl);
                    setIsEditOpen(true);
                  }}>
                    <Edit2 size={16} />
                  </Button>
                  <Button variant="ghost" size="sm" aria-label="Delete" className="text-error" onClick={() => handleDelete(link.alias)}>
                    <Trash2 size={16} />
                  </Button>
                </div>
              </Card>
            ))}
            
            {!loading && links.length === 0 && (
              <div className="empty-state">
                <AlertCircle size={48} className="text-secondary" />
                <h3>No links found</h3>
                <p>Create your first shortened link to get started.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Modal */}
      {isCreateOpen && (
        <div className="modal-overlay" onClick={() => setIsCreateOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2>Create New Link</h2>
              <button onClick={() => setIsCreateOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)' }}><X /></button>
            </div>
            <form onSubmit={handleCreateSubmit}>
              <Input 
                label="Destination URL" 
                placeholder="https://example.com/very-long-url" 
                value={originalUrl} 
                onChange={(e) => setOriginalUrl(e.target.value)} 
                required 
              />
              <Input 
                label="Custom Alias (Optional)" 
                placeholder="my-campaign" 
                value={customAlias} 
                onChange={(e) => setCustomAlias(e.target.value)} 
                className="mt-4"
              />
              <div className="modal-actions">
                <Button variant="secondary" type="button" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Creating...' : 'Create'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditOpen && editingLink && (
        <div className="modal-overlay" onClick={() => setIsEditOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2>Edit Link</h2>
              <button onClick={() => setIsEditOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-secondary)' }}><X /></button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <Input 
                label="Destination URL" 
                value={originalUrl} 
                onChange={(e) => setOriginalUrl(e.target.value)} 
                required 
              />
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px' }}>
                <input 
                  type="checkbox" 
                  id="active-status" 
                  checked={editingLink.isActive}
                  onChange={(e) => setEditingLink({...editingLink, isActive: e.target.checked})}
                />
                <label htmlFor="active-status">Active Status</label>
              </div>

              <div className="modal-actions">
                <Button variant="secondary" type="button" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : 'Save Changes'}</Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;
