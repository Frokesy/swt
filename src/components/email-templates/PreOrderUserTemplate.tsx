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

interface PreorderUserTemplateProps {
  name: string;
  productName: string;
  quantity: number;
  deliveryDate?: string;
}

export const PreorderUserTemplate: FC<PreorderUserTemplateProps> = ({
  name,
  productName,
  quantity,
  deliveryDate,
}) => (
  <Html>
    <Head />
    <Preview>Your Rehubot Preorder Confirmation 🍞</Preview>
    <Body style={styles.body}>
      <Container style={styles.container}>
        <Heading style={styles.heading}>Preorder Confirmed 🎉</Heading>

        <Section>
          <Text style={styles.text}>
            Hi <strong>{name}</strong>,
          </Text>

          <Text style={styles.text}>
            Thank you for preordering with <strong>Rehubot</strong>! We’ve
            received your preorder and our team will reach out once your item is
            ready.
          </Text>

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
              <strong>Preferred Delivery Date:</strong>{' '}
              {deliveryDate || 'Not specified'}
            </li>
          </ul>

          <Text style={styles.text}>
            We’ll notify you as soon as it’s ready for pickup or delivery. 🍪
          </Text>
        </Section>

        <Section style={styles.footer}>
          <Text style={styles.footerText}>
            © {new Date().getFullYear()} Rehubot. All rights reserved.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

const styles = {
  body: {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f7f7f7',
    color: '#333',
  },
  container: {
    maxWidth: '600px',
    margin: '20px auto',
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
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
