import React from 'react';
import styled from 'styled-components';

interface OrderSummaryProps {
  subTotal: number;
  shippingPrice: string;
  tax?: string;
  totalPrice?: string;
  className?: string;
}

const OrderSummary: React.FC<OrderSummaryProps> = props => {
  return (
    <Section className={props.className}>
      <Heading>ORDER SUMMARY</Heading>
      <RowContainer>
        <Paragraph>Subtotal:</Paragraph>
        <Paragraph>${props.subTotal}</Paragraph>
      </RowContainer>
      <RowContainer>
        <Paragraph>Shipping:</Paragraph>
        <Paragraph>{props.shippingPrice}</Paragraph>
      </RowContainer>
      <RowContainer>
        <Paragraph>Tax:</Paragraph>
        <Paragraph>{props.tax || 'TBD'}</Paragraph>
      </RowContainer>
      <RowContainer>
        <Total>Total Price:</Total>
        <Total>${props.totalPrice ? props.totalPrice : props.subTotal}</Total>
      </RowContainer>
    </Section>
  );
};

export default OrderSummary;

const Section = styled.section`
  grid-column: 2/3;
  grid-row: 2/3;
  align-self: center;
  background: #fff6f0;
  padding: 1rem;
  width: 100%;
  height: max-content;
  margin-left: 1rem;

  @media (max-width: 768px) {
    grid-column: 1/2;
    grid-row: auto;
    margin: 0;
    margin-top: -2rem;
  }
`;

const RowContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Heading = styled.h3`
  margin: 0;
`;

const Paragraph = styled.p`
  margin: 0;
`;

const Total = styled.p`
  margin: 0;
  font-weight: 600;
`;
