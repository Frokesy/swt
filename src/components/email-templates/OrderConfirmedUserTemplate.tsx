import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Heading,
  Section,
  Text,
  Link,
} from '@react-email/components';
import type { FC } from 'react';

interface OrderConfirmedUserTemplateProps {
  firstname?: string;
  orderId: string;
  total: number;
  items: { name: string; quantity: number; price: number }[];
}

export const OrderConfirmedUserTemplate: FC<
  OrderConfirmedUserTemplateProps
> = ({ firstname, orderId, total, items }) => {
  return (
    <Html>
      <Head />
      <Preview>Your order is confirmed! 🥖</Preview>
      <Body style={{ fontFamily: 'Arial, sans-serif', color: '#333' }}>
        <Container
          style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}
        >
          <Heading style={{ textAlign: 'center', color: '#16a34a' }}>
            Order Confirmed ✅
          </Heading>

          <Section>
            <Text style={styles.text}>
              Hi {firstname || 'there'}, thank you for your order! 🍞
            </Text>

            <Text style={styles.text}>
              Your order <b>#{orderId}</b> has been confirmed and is now being
              prepared.
            </Text>

            <Text style={styles.text}>
              <b>Order Summary:</b>
            </Text>
            <ul style={{ paddingLeft: '20px', marginBottom: '10px' }}>
              {items.map((item, index) => (
                <li key={index} style={{ fontSize: '15px', color: '#555' }}>
                  {item.name} × {item.quantity} — $
                  {(item.price * item.quantity).toFixed(2)}
                </li>
              ))}
            </ul>

            <Text style={styles.text}>
              <b>Total Paid:</b> ${total.toFixed(2)}
            </Text>

            <Text style={styles.text}>
              You’ll receive another email once your order is out for delivery.
            </Text>

            <Text style={styles.text}>
              Track your orders on{' '}
              <Link href="https://freshbake.vercel.app" style={styles.link}>
                Rehubot
              </Link>
              .
            </Text>
          </Section>

          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              © {new Date().getFullYear()} Rehubot. All rights reserved.
            </Text>
            <Text style={styles.footerText}>
              Rehubot HQ, 123 Bakery Street, Sweet City 🍪
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const styles = {
  text: {
    fontSize: '16px',
    color: '#555555',
    lineHeight: '1.5',
  },
  link: {
    color: '#16a34a',
    textDecoration: 'none',
  },
  footer: {
    borderTop: '1px solid #eaeaea',
    paddingTop: '10px',
    textAlign: 'center' as const,
    marginTop: '20px',
  },
  footerText: {
    fontSize: '12px',
    color: '#999999',
    marginBottom: '5px',
  },
};
