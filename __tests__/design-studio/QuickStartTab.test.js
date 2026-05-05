/**
 * QuickStartTab — Unit Tests
 * 
 * Tests that preset selection calls onApplyPreset with correct config shape.
 */

import { render, screen, fireEvent } from '@testing-library/react';
import { QuickStartTab } from '@/components/dashboard/design-studio/QuickStartTab';

describe('QuickStartTab', () => {
    const mockOnApply = jest.fn();

    beforeEach(() => {
        mockOnApply.mockClear();
    });

    test('renders all three preset cards', () => {
        render(<QuickStartTab onApplyPreset={mockOnApply} currentPresetId={null} />);

        expect(screen.getByText('Midnight Neon')).toBeInTheDocument();
        expect(screen.getByText('Alpine Frost')).toBeInTheDocument();
        expect(screen.getByText('Organic Matcha')).toBeInTheDocument();
    });

    test('clicking a preset calls onApplyPreset with preset object', () => {
        render(<QuickStartTab onApplyPreset={mockOnApply} currentPresetId={null} />);

        fireEvent.click(screen.getByText('Midnight Neon'));

        expect(mockOnApply).toHaveBeenCalledTimes(1);
        const passedPreset = mockOnApply.mock.calls[0][0];
        expect(passedPreset.id).toBe('midnight-neon');
        expect(passedPreset.config).toBeDefined();
        expect(passedPreset.config.colors).toBeDefined();
        expect(passedPreset.config.colors.brand.primary).toBeTruthy();
    });

    test('preset config contains required fields', () => {
        render(<QuickStartTab onApplyPreset={mockOnApply} currentPresetId={null} />);

        fireEvent.click(screen.getByText('Alpine Frost'));

        const config = mockOnApply.mock.calls[0][0].config;
        expect(config.colors.brand).toBeDefined();
        expect(config.colors.backgrounds).toBeDefined();
        expect(config.colors.text).toBeDefined();
        expect(config.typography.fonts.heading.family).toBeTruthy();
        expect(config.layoutID).toBeTruthy();
    });

    test('shows checkmark on active preset', () => {
        const { container } = render(
            <QuickStartTab onApplyPreset={mockOnApply} currentPresetId="midnight-neon" />
        );

        // The active preset should have a Check icon (rendered as svg inside a div)
        const checkmarks = container.querySelectorAll('.bg-zinc-900.rounded-full');
        expect(checkmarks.length).toBeGreaterThan(0);
    });
});
