declare module 'react-world-flags' {
    import React from 'react';
  
    interface FlagProps extends React.HTMLAttributes<HTMLImageElement> {
      code: string;
    }
  
    const Flag: React.FC<FlagProps>;
  
    export default Flag;
  }
  