import React from 'react';
import { Button, Typography, Tag, Space, Divider, Row, Col, Card } from 'antd';
import { ArrowLeftOutlined, UserOutlined, ClockCircleOutlined, EyeOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import moment from 'moment';
import type { Post } from '../index';

const { Title, Paragraph, Text } = Typography;

interface PostDetailProps {
    postId: string;
    posts: Post[];
    onBack: () => void;
    onViewPost: (id: string) => void;
}

const PostDetail = ({ postId, posts, onBack, onViewPost }: PostDetailProps) => {
    const post = posts.find(p => p.id === postId);

    if (!post) {
        return <div>Bài viết không tồn tại.</div>;
    }

    const relatedPosts = posts
        .filter(p => p.id !== postId && p.status === 'Published' && p.tags.some(t => post.tags.includes(t)))
        .slice(0, 3);

    return (
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <Button 
                icon={<ArrowLeftOutlined />} 
                onClick={onBack} 
                style={{ marginBottom: 24 }}
            >
                Quay lại danh sách
            </Button>

            <img 
                src={post.thumbnail} 
                alt={post.title} 
                style={{ width: '100%', height: 400, objectFit: 'cover', borderRadius: 8, marginBottom: 24 }} 
            />

            <Title level={1}>{post.title}</Title>
            
            <Space style={{ marginBottom: 24 }} split={<Divider type="vertical" />}>
                <Text type="secondary"><UserOutlined /> {post.author}</Text>
                <Text type="secondary"><ClockCircleOutlined /> {moment(post.createdAt).format('DD/MM/YYYY HH:mm')}</Text>
                <Text type="secondary"><EyeOutlined /> {post.views} lượt xem</Text>
            </Space>

            <div style={{ marginBottom: 24 }}>
                {post.tags.map(tag => (
                    <Tag color="geekblue" key={tag}>{tag}</Tag>
                ))}
            </div>

            <Typography>
                <div style={{ fontSize: '16px', lineHeight: '1.8' }}>
                    <ReactMarkdown>{post.content}</ReactMarkdown>
                </div>
            </Typography>

            {relatedPosts.length > 0 && (
                <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid #f0f0f0' }}>
                    <Title level={3}>Bài viết liên quan</Title>
                    <Row gutter={16}>
                        {relatedPosts.map(rp => (
                            <Col xs={24} sm={8} key={rp.id}>
                                <Card 
                                    hoverable 
                                    cover={<img alt={rp.title} src={rp.thumbnail} style={{ height: 120, objectFit: 'cover' }}/>}
                                    style={{ marginBottom: 16 }}
                                    onClick={() => onViewPost(rp.id)}
                                >
                                    <Card.Meta title={rp.title} description={moment(rp.createdAt).format('DD/MM/YYYY')} />
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            )}
        </div>
    );
};

export default PostDetail;
