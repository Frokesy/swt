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

interface NewOrderAdminTemplateProps {
  orderId: string;
  customerName: string;
  customerEmail: string;
  total: number;
  items: { name: string; quantity: number; price: number }[];
  deliveryAddress: string;
}

export const NewOrderAdminTemplate: FC<NewOrderAdminTemplateProps> = ({
  orderId,
  customerName,
  customerEmail,
  total,
  items,
  deliveryAddress,
}) => {
  return (
    <Html>
      <Head />
      <Preview>New order received on Rehubot 🧾</Preview>
      <Body style={{ fontFamily: 'Arial, sans-serif', color: '#333' }}>
        <Container
          style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}
        >
          <Heading style={{ textAlign: 'center', color: '#b45309' }}>
            New Order Alert 🚨
          </Heading>

          <Section>
            <Text style={styles.text}>
              A new order has been placed on Rehubot.
            </Text>

            <Text style={styles.text}>
              <b>Order ID:</b> #{orderId}
              <br />
              <b>Customer:</b> {customerName}
              <br />
              <b>Email:</b> {customerEmail}
            </Text>

            <Text style={styles.text}>
              <b>Items Ordered:</b>
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
              <b>Total:</b> ${total.toFixed(2)}
            </Text>

            <Text style={styles.text}>
              <b>Delivery Address:</b>
              <br />
              {deliveryAddress}
            </Text>

            <Text style={styles.text}>
              Log into your admin dashboard to confirm and process the order.
            </Text>
          </Section>

          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              © {new Date().getFullYear()} Rehubot Admin.
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
