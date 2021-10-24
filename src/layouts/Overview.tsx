import React from 'react';
import { Redirect } from 'wouter';
import { Links } from './listViews';

export const Overview = () => <Redirect to={Links.accounts()} />;
