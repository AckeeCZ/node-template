#!/bin/bash

dockerize -wait tcp://postgres:5432 -timeout 5m "$@"
