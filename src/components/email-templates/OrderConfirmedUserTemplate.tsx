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

interface OrderUserTemplateProps {
  firstname?: string;
  total: number;
  items: { name: string; quantity: number; price: number }[];
}

export const OrderConfirmedUserTemplate: FC<OrderUserTemplateProps> = ({
  firstname,
  total,
  items,
}) => (
  <Html>
    <Head />
    <Preview>Your Rehubot order is confirmed! 🥖</Preview>
    <Body style={{ fontFamily: 'Arial, sans-serif', color: '#333' }}>
      <Container
        style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}
      >
        <Heading style={{ color: '#7d6c3a', textAlign: 'center' }}>
          Thanks for your order, {firstname || 'there'}!
        </Heading>
        <Section>
          <Text style={{ fontSize: '16px', color: '#555', lineHeight: '1.5' }}>
            We're thrilled to confirm your Rehubot order. 🍞
          </Text>

          <Text style={{ fontSize: '16px', color: '#555', lineHeight: '1.5' }}>
            <strong>Order Summary:</strong>
          </Text>
          <ul style={{ paddingLeft: '20px', color: '#555' }}>
            {items.map((item, index) => (
              <li key={index}>
                {item.name} × {item.quantity} — ${item.price.toFixed(2)}
              </li>
            ))}
          </ul>
          <Text style={{ fontWeight: 'bold' }}>Total: ${total.toFixed(2)}</Text>

          <Text style={{ fontSize: '16px', color: '#555', marginTop: '10px' }}>
            We’ll start preparing your order shortly. You’ll receive an update
            once it’s ready for delivery 🚚.
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
