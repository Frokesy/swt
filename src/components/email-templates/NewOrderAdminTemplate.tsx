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

interface OrderAdminTemplateProps {
  customerName?: string;
  customerEmail: string;
  total: number;
  items: { name: string; quantity: number; price: number }[];
}

export const NewOrderAdminTemplate: FC<OrderAdminTemplateProps> = ({
  customerName,
  customerEmail,
  total,
  items,
}) => (
  <Html>
    <Head />
    <Preview>New Rehubot Order Received 📦</Preview>
    <Body style={{ fontFamily: 'Arial, sans-serif', color: '#333' }}>
      <Container
        style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}
      >
        <Heading style={{ color: '#7d6c3a', textAlign: 'center' }}>
          New Order Notification
        </Heading>
        <Section>
          <Text style={styles.text}>
            A new order has been placed on Rehubot by{' '}
            <strong>{customerName || 'Anonymous'}</strong>.
          </Text>

          <Text style={styles.text}>
            <strong>Email:</strong> {customerEmail}
          </Text>

          <Text style={{ fontWeight: 'bold', marginTop: '10px' }}>Items:</Text>
          <ul style={{ paddingLeft: '20px' }}>
            {items.map((item, index) => (
              <li key={index}>
                {item.name} × {item.quantity} — ${item.price.toFixed(2)}
              </li>
            ))}
          </ul>

          <Text style={{ fontWeight: 'bold' }}>Total: ${total.toFixed(2)}</Text>
        </Section>

        <Section style={styles.footer}>
          <Text style={styles.footerText}>
            © {new Date().getFullYear()} Rehubot Admin Portal.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

const styles = {
  text: {
    fontSize: '16px',
    color: '#555',
    lineHeight: '1.5',
  },
  footer: {
    borderTop: '1px solid #eaeaea',
    paddingTop: '10px',
    textAlign: 'center' as const,
    marginTop: '20px',
  },
  footerText: {
    fontSize: '12px',
    color: '#999',
  },
};
