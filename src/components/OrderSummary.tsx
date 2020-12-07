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
    <StyledSection className={props.className}>
      <StyledH3>ORDER SUMMARY</StyledH3>
      <StyledRowDiv>
        <StyledP>Subtotal:</StyledP>
        <StyledP>${props.subTotal}</StyledP>
      </StyledRowDiv>
      <StyledRowDiv>
        <StyledP>Shipping:</StyledP>
        <StyledP>{props.shippingPrice}</StyledP>
      </StyledRowDiv>
      <StyledRowDiv>
        <StyledP>Tax:</StyledP>
        <StyledP>{props.tax || 'TBD'}</StyledP>
      </StyledRowDiv>
      <StyledRowDiv>
        <StyledTotal>Total Price:</StyledTotal>
        <StyledTotal>${props.totalPrice ? props.totalPrice : props.subTotal}</StyledTotal>
      </StyledRowDiv>
    </StyledSection>
  );
};

export default OrderSummary;

const StyledSection = styled.section`
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

const StyledRowDiv = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledH3 = styled.h3`
  margin: 0;
`;

const StyledTotal = styled.h4`
  margin: 0;
`;

const StyledP = styled.p`
  margin: 0;
`;
