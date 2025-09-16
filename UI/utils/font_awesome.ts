// src/utils/fontawesome.ts
import { IconDefinition, library } from '@fortawesome/fontawesome-svg-core';
import { authIcons } from '../components/icons/authIcons';
import { invoiceIcons } from '../components/icons/invoiceIcons';
import { navigationIcons } from '../components/icons/navigationIcons';

// Add icons by spreading arrays
library.add(...authIcons, ...invoiceIcons, ...navigationIcons);
// Now you can import and use FontAwesomeIcon in your components
// Example: import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
// <FontAwesomeIcon icon="user" />