import React, { useState, useEffect, useMemo } from 'react';
import { Card, Input, Tag, List, Typography, Space, Row, Col } from 'antd';
import { SearchOutlined, EyeOutlined, ClockCircleOutlined, UserOutlined } from '@ant-design/icons';
import type { Post, Tag as TagType } from '../index';
import moment from 'moment';

const { Paragraph, Title, Text } = Typography;

interface HomeProps {
    posts: Post[];
    tags: TagType[];
    onViewPost: (id: string) => void;
}

const Home = ({ posts, tags, onViewPost }: HomeProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const filteredPosts = useMemo(() => {
        return posts.filter(post => {
            const matchSearch = post.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                post.summary.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
            const matchTag = selectedTag ? post.tags.includes(selectedTag) : true;
            return matchSearch && matchTag;
        }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [posts, debouncedSearchTerm, selectedTag]);

    return (
        <div>
            <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                <Input
                    placeholder="Tìm kiếm bài viết..."
                    prefix={<SearchOutlined />}
                    onChange={e => setSearchTerm(e.target.value)}
                    value={searchTerm}
                    style={{ width: 300 }}
                    allowClear
                />

                <Space wrap>
                    <Text strong>Lọc theo thẻ:</Text>
                    <Tag.CheckableTag
                        checked={selectedTag === null}
                        onChange={() => setSelectedTag(null)}
                    >
                        Tất cả
                    </Tag.CheckableTag>
                    {tags.map(tag => (
                        <Tag.CheckableTag
                            key={tag.id}
                            checked={selectedTag === tag.name}
                            onChange={(checked) => setSelectedTag(checked ? tag.name : null)}
                        >
                            {tag.name}
                        </Tag.CheckableTag>
                    ))}
                </Space>
            </div>

            <List
                grid={{ gutter: 24, xs: 1, sm: 2, md: 3, lg: 3, xl: 3, xxl: 4 }}
                pagination={{
                    pageSize: 9,
                    position: 'bottom'
                }}
                dataSource={filteredPosts}
                renderItem={(post) => (
                    <List.Item>
                        <Card
                            hoverable
                            cover={<img alt={post.title} src={post.thumbnail} style={{ height: 200, objectFit: 'cover' }} />}
                            onClick={() => onViewPost(post.id)}
                            style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
                            bodyStyle={{ flex: 1, display: 'flex', flexDirection: 'column' }}
                        >
                            <Title level={4} style={{ marginBottom: 8, fontSize: '18px' }} ellipsis={{ rows: 2 }}>{post.title}</Title>
                            <Space style={{ marginBottom: 12 }}>
                                {post.tags.map(tag => (
                                    <Tag color="geekblue" key={tag}>{tag}</Tag>
                                ))}
                            </Space>
                            <Paragraph type="secondary" ellipsis={{ rows: 3 }} style={{ flex: 1 }}>
                                {post.summary}
                            </Paragraph>
                            <div style={{ marginTop: 'auto', paddingTop: 12, borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                                <Space>
                                    <UserOutlined /> {post.author}
                                </Space>
                                <Space>
                                    <Space><ClockCircleOutlined /> {moment(post.createdAt).format('DD/MM/YYYY')}</Space>
                                    <Space><EyeOutlined /> {post.views}</Space>
                                </Space>
                            </div>
                        </Card>
                    </List.Item>
                )}
            />
        </div>
    );
};

export default Home;
