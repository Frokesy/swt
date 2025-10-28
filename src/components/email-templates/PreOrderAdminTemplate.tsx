import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Heading,
  Section,
  Text,
} from '@react-email/components';
import type { FC } from 'react';

interface PreorderAdminTemplateProps {
  productName: string;
  description?: string;
  quantity: number;
  deliveryDate?: string;
  name: string;
  email: string;
  phone: string;
}

export const PreorderAdminTemplate: FC<PreorderAdminTemplateProps> = ({
  productName,
  description,
  quantity,
  deliveryDate,
  name,
  email,
  phone,
}) => (
  <Html>
    <Head />
    <Preview>New Rehubot Preorder Received 🧾</Preview>
    <Body style={styles.body}>
      <Container style={styles.container}>
        <Heading style={styles.heading}>New Preorder Notification</Heading>

        <Section>
          <Text style={styles.text}>
            A new preorder has just been submitted on <strong>Rehubot</strong>.
          </Text>

          <Text style={styles.text}>
            <strong>Customer Details:</strong>
          </Text>
          <ul style={styles.list}>
            <li>
              <strong>Name:</strong> {name}
            </li>
            <li>
              <strong>Email:</strong> {email}
            </li>
            <li>
              <strong>Phone:</strong> {phone}
            </li>
          </ul>

          <Text style={styles.text}>
            <strong>Order Details:</strong>
          </Text>
          <ul style={styles.list}>
            <li>
              <strong>Product:</strong> {productName}
            </li>
            <li>
              <strong>Quantity:</strong> {quantity}
            </li>
            <li>
              <strong>Delivery Date:</strong> {deliveryDate || 'Not specified'}
            </li>
            {description && (
              <li>
                <strong>Description:</strong> {description}
              </li>
            )}
          </ul>
        </Section>

        <Section style={styles.footer}>
          <Text style={styles.footerText}>
            © {new Date().getFullYear()} Rehubot Admin Dashboard.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

const styles = {
  body: {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f8f9fa',
    color: '#333',
  },
  container: {
    maxWidth: '600px',
    margin: '20px auto',
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  heading: {
    color: '#166534',
    textAlign: 'center' as const,
    marginBottom: '20px',
  },
  text: {
    fontSize: '16px',
    lineHeight: '1.6',
    color: '#555',
  },
  list: {
    paddingLeft: '20px',
    color: '#444',
  },
  footer: {
    borderTop: '1px solid #eee',
    paddingTop: '10px',
    textAlign: 'center' as const,
    marginTop: '30px',
  },
  footerText: {
    fontSize: '12px',
    color: '#999',
  },
};
