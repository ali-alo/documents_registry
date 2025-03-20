import { TestBed } from '@angular/core/testing';

import { ThemeService } from './theme.service';
import { DOCUMENT } from '@angular/common';

describe('ThemeService', () => {
  let service: ThemeService;
  let documentMock: Document;

  beforeEach(() => {
    // mocking dependencies
    documentMock = document.implementation.createHTMLDocument();
    spyOn(localStorage, 'getItem');
    spyOn(localStorage, 'setItem');
    TestBed.configureTestingModule({
      providers: [ThemeService, { provide: DOCUMENT, useValue: documentMock }],
    });
  });

  it('should be created', () => {
    service = TestBed.inject(ThemeService);
    expect(service).toBeTruthy();
  });

  it('should initialize with dark theme if it is preffered in local storage', () => {
    // custom service configuration with dark theme in local stroage
    (localStorage.getItem as jasmine.Spy).and.returnValue('dark');
    service = TestBed.inject(ThemeService);
    expect(
      documentMock.documentElement.classList.contains('dark-mode')
    ).toBeTrue();
    expect(localStorage.getItem).toHaveBeenCalledTimes(1);
  });

  it('should toggle theme from light to dark', () => {
    service = TestBed.inject(ThemeService);
    service.toggleTheme();
    expect(
      documentMock.documentElement.classList.contains('dark-mode')
    ).toBeTrue();
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'preferred-theme',
      'dark'
    );
  });

  it('should toggle theme from dark to light', () => {
    service = TestBed.inject(ThemeService);
    // default theme is light, so we start from there
    service.toggleTheme(); // first toggle: light -> dark
    service.toggleTheme(); // second toggle: dark -> light
    expect(
      documentMock.documentElement.classList.contains('dark-mode')
    ).toBeFalse();
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'preferred-theme',
      'light'
    );
  });
});
