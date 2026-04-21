import React from 'react';
import { Card, Avatar, Typography, Divider, Space, Tag, Button } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import type { Author } from '../index';

const { Title, Paragraph } = Typography;

interface AboutProps {
    author: Author;
}

const About = ({ author }: AboutProps) => {
    return (
        <Card style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', padding: '24px 0' }}>
            <Avatar size={120} src={author.avatar} style={{ marginBottom: 16, border: '2px solid #1890ff' }} />
            <Title level={2}>{author.name}</Title>
            
            <Paragraph style={{ fontSize: '16px', maxWidth: 600, margin: '0 auto', color: '#595959' }}>
                {author.bio}
            </Paragraph>
            
            <Divider>Kỹ Năng</Divider>
            <Space wrap style={{ justifyContent: 'center', marginBottom: 24 }}>
                {author.skills.map(skill => (
                    <Tag color="cyan" key={skill} style={{ padding: '4px 12px', fontSize: '14px' }}>
                        {skill}
                    </Tag>
                ))}
            </Space>

            <Divider>Liên Kết</Divider>
            <Space size="large">
                {author.socialLinks.map(link => (
                    <Button 
                        key={link.label} 
                        type="dashed" 
                        icon={<GlobalOutlined />} 
                        href={link.url} 
                        target="_blank"
                    >
                        {link.label}
                    </Button>
                ))}
            </Space>
        </Card>
    );
};

export default About;
