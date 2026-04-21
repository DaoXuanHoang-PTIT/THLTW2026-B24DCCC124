import React, { useState, useEffect } from 'react';
import { Tabs, Badge } from 'antd';
import Home from './components/Home';
import PostDetail from './components/PostDetail';
import About from './components/About';
import ManagePosts from './components/ManagePosts';
import ManageTags from './components/ManageTags';

const { TabPane } = Tabs;

export interface Tag {
    id: string;
    name: string;
}

export interface Post {
    id: string;
    title: string;
    slug: string;
    summary: string;
    content: string;
    thumbnail: string;
    tags: string[];
    author: string;
    createdAt: string;
    views: number;
    status: 'Draft' | 'Published';
}

export interface Author {
    name: string;
    avatar: string;
    bio: string;
    skills: string[];
    socialLinks: { label: string; url: string }[];
}

export const initialTags: Tag[] = [
    { id: 't1', name: 'React' },
    { id: 't2', name: 'JavaScript' },
    { id: 't3', name: 'Web Development' },
    { id: 't4', name: 'Frontend' },
    { id: 't5', name: 'UI/UX' },
];

export const initialPosts: Post[] = Array.from({ length: 15 }).map((_, i) => ({
    id: `p${i + 1}`,
    title: `Bài viết mẫu ${i + 1} về lập trình web`,
    slug: `bai-viet-mau-${i + 1}`,
    summary: `Đây là đoạn tóm tắt cho bài viết mẫu số ${i + 1}. Bài viết này chia sẻ các kinh nghiệm và kỹ thuật quan trọng...`,
    content: `## Nội dung bài viết ${i + 1}
    
Đây là nội dung chi tiết của bài viết được viết bằng **Markdown**.

### Các điểm chính:
- Điểm 1: Tìm hiểu cơ bản
- Điểm 2: Thực hành chuyên sâu
- Điểm 3: Tối ưu hiệu năng

Bạn có thể thêm code:
\`\`\`javascript
const greeting = "Hello World";
console.log(greeting);
\`\`\`

Cảm ơn bạn đã đọc bài viết!
`,
    thumbnail: '',
    tags: i % 2 === 0 ? ['React', 'Frontend'] : ['JavaScript', 'Web Development'],
    author: 'Dao Xuan Hoang',
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    views: Math.floor(Math.random() * 1000),
    status: i % 5 === 0 ? 'Draft' : 'Published',
}));

export const authorInfo: Author = {
    name: 'Đào Xuân Hoàng',
    avatar: '',
    bio: 'Tôi là một lập trình viên đam mê với công nghệ web, luôn thích khám phá và xây dựng các sản phẩm mang lại giá trị thực tế.',
    skills: ['React', 'TypeScript', 'Node.js', 'Ant Design', 'Tailwind CSS'],
    socialLinks: [
        { label: 'GitHub', url: 'https://github.com' },
        { label: 'LinkedIn', url: 'https://linkedin.com' },
    ]
};

const BlogApp = () => {
    const [posts, setPosts] = useState<Post[]>(() => {
        const saved = localStorage.getItem('th07_posts');
        if (saved) { try { return JSON.parse(saved); } catch (e) { } }
        return initialPosts;
    });

    const [tags, setTags] = useState<Tag[]>(() => {
        const saved = localStorage.getItem('th07_tags');
        if (saved) { try { return JSON.parse(saved); } catch (e) { } }
        return initialTags;
    });

    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('1');

    useEffect(() => {
        localStorage.setItem('th07_posts', JSON.stringify(posts));
    }, [posts]);

    useEffect(() => {
        localStorage.setItem('th07_tags', JSON.stringify(tags));
    }, [tags]);

    const handleViewPost = (id: string) => {
        const updatedPosts = posts.map(p => p.id === id ? { ...p, views: p.views + 1 } : p);
        setPosts(updatedPosts);
        setSelectedPostId(id);
    };

    const handleBackInfo = () => {
        setSelectedPostId(null);
    };

    const handleTabChange = (key: string) => {
        setActiveTab(key);
        if (key === '1') {
            setSelectedPostId(null);
        }
    };

    return (
        <div style={{ padding: '24px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
            <h1 style={{ textAlign: 'center', marginBottom: 24 }}>Ứng Dụng Blog Cá Nhân</h1>
            <div style={{ background: '#fff', padding: 24, borderRadius: 8 }}>
                <Tabs activeKey={activeTab} onChange={handleTabChange} destroyInactiveTabPane>
                    <TabPane tab="Trang Chủ" key="1">
                        {selectedPostId ? (
                            <PostDetail
                                postId={selectedPostId}
                                posts={posts}
                                onBack={handleBackInfo}
                                onViewPost={handleViewPost}
                            />
                        ) : (
                            <Home
                                posts={posts.filter(p => p.status === 'Published')}
                                tags={tags}
                                onViewPost={handleViewPost}
                            />
                        )}
                    </TabPane>
                    <TabPane tab="Giới Thiệu" key="2">
                        <About author={authorInfo} />
                    </TabPane>
                    <TabPane
                        tab={
                            <span>
                                Quản Lý Bài Viết
                                <Badge count={posts.length} style={{ marginLeft: 8, backgroundColor: '#52c41a' }} />
                            </span>
                        }
                        key="3"
                    >
                        <ManagePosts posts={posts} setPosts={setPosts} tags={tags} />
                    </TabPane>
                    <TabPane
                        tab={
                            <span>
                                Quản Lý Thẻ
                                <Badge count={tags.length} style={{ marginLeft: 8 }} />
                            </span>
                        }
                        key="4"
                    >
                        <ManageTags tags={tags} setTags={setTags} posts={posts} />
                    </TabPane>
                </Tabs>
            </div>
        </div>
    );
};

export default BlogApp;
