import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const SeparatorContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  margin: ${props => props.margin};
`;

const Line = styled.div`
  flex: 1;
  height: ${props => props.height};
  background-color: ${props => props.color};
`;

const Text = styled.span`
  padding: 0 10px;
  color: ${props => props.textColor};
  font-size: ${props => props.textSize};
`;


const Separator = ({
  height = '1px',
  color = '#ddd',
  margin = '20px 0',
  text,
  textColor = '#999',
  textSize = '14px'
}) => {
  return (
    <SeparatorContainer margin={margin}>
      <Line height={height} color={color} />
      {text && <Text textColor={textColor} textSize={textSize}>{text}</Text>}
      <Line height={height} color={color} />
    </SeparatorContainer>
  );
};

Separator.propTypes = {
  height: PropTypes.string,
  color: PropTypes.string,
  margin: PropTypes.string,
  text: PropTypes.string,
  textColor: PropTypes.string,
  textSize: PropTypes.string,
};

export {Separator};