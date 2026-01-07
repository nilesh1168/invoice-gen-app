import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CreateInvoiceScreen from '../../src/app/invoice/create';
import { useAuthContext } from '../../src/context/AuthContext';
import { useToast } from '../../src/hooks/useToast';
import { router } from 'expo-router';

jest.mock('../../src/context/AuthContext');
jest.mock('../../src/hooks/useToast');
jest.mock('react-native-keyboard-controller', () => ({
  KeyboardAwareScrollView: ({ children }: any) => children,
  KeyboardToolbar: () => null,
}));
jest.mock('expo-router', () => ({
  router: {
    replace: jest.fn(),
    push: jest.fn(),
    back: jest.fn(),
  },
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    canGoBack: () => false,
    goBack: jest.fn(),
  }),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

// Instrument BusinessInfoSection and ClientInfoSection to count renders
const renderCounts = { business: 0, client: 0 };
jest.mock('../../src/components/invoice', () => {
  const React = require('react');
  const actual = jest.requireActual('../../src/components/invoice');

  const BusinessInfoSection = React.memo((props: any) => {
    renderCounts.business += 1;
    return React.createElement(actual.BusinessInfoSection, props);
  });

  const ClientInfoSection = React.memo((props: any) => {
    renderCounts.client += 1;
    return React.createElement(actual.ClientInfoSection, props);
  });

  return {
    __esModule: true,
    ...actual,
    BusinessInfoSection,
    ClientInfoSection,
    __renderCounts: renderCounts,
  };
});

describe('CreateInvoiceScreen memoization', () => {
  const mockUseAuthContext = useAuthContext as jest.MockedFunction<typeof useAuthContext>;
  const mockUseToast = useToast as jest.MockedFunction<typeof useToast>;

  beforeEach(() => {
    jest.clearAllMocks();
    renderCounts.business = 0;
    renderCounts.client = 0;

    mockUseAuthContext.mockReturnValue({
      loading: false,
      userDetails: {
        uid: '123',
        displayName: 'Biz User',
        email: 'biz@example.com',
        address: '',
      },
      logout: jest.fn(),
    } as any);

    mockUseToast.mockReturnValue({
      toasts: [],
      showToast: jest.fn(),
      hideToast: jest.fn(),
    });
  });

  test('BusinessInfoSection and ClientInfoSection do not re-render when line items change', () => {
    const { getByText } = render(<CreateInvoiceScreen />);

    expect(renderCounts.business).toBe(1);
    expect(renderCounts.client).toBe(1);

    fireEvent.press(getByText('+ Add Item'));

    expect(renderCounts.business).toBe(1);
    expect(renderCounts.client).toBe(1);
    expect(router.replace).not.toHaveBeenCalled();
  });
});
