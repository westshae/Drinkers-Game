export default interface AvailableLocations {
    [city: string]: {
        [street: string]: {
            [number: number]: {
                id: string;
            };
        };
    };
}
